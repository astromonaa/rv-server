const { User } = require("../models/models")
const uuid = require('uuid')
const bcrypt = require('bcrypt')
const UserDto = require('../dtos/userDto')
const tokenService = require('./tokenService')
const ApiError = require("../error/ApiError")

class userService {
  
  async registration(email, password) {
    if (!email || !password) {
      throw ApiError.badRequest('invalid email or password')
    }
    const candidate = await User.findOne({where: {email}})
    if (candidate) {
      throw ApiError.badRequest('email already registered')
    }
    const activationLink = uuid.v4()
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({email, password: hashPassword, activationLink})

    const userDto = new UserDto(user)
    const tokens = await tokenService.generateTokens({...userDto})
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {user: userDto, ...tokens}
  }
  async login(email, password) {
    const candidate = await User.findOne({where: {email}})
    if (!candidate) {
      throw ApiError.badRequest('Unauthorized')
    }
    const isPassEquals = await bcrypt.compare(password, candidate.password)
    if (!isPassEquals) {
      throw ApiError.badRequest('invalid password')
    }
    const userDto = new UserDto(candidate)
    const tokens = await tokenService.generateTokens({...userDto})
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return {user: userDto, ...tokens}
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.badRequest('Unauthorized')
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenInDb = tokenService.findToken(refreshToken)
    if (!userData || !tokenInDb) {
      throw ApiError.badRequest('Unauthorized')
    }
    const user = await User.findOne({where: {id: userData.id}})
    const userDto = new UserDto(user)
    const tokens = await tokenService.generateTokens({...userDto})
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { user: userDto, ...tokens }
  }
}

module.exports = new userService