const {Token} = require('../models/models')
const jwt = require('jsonwebtoken')

class tokenService {

  async generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {expiresIn: '1d'})
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {expiresIn: '30d'})
    return {
      accessToken,
      refreshToken
    }
  }
  async saveToken(userId, refreshToken) {
    const candidate = await Token.findOne({where: {userId}})
    if (candidate) {
      return candidate.update({refreshToken})
    }
    const token = await Token.create({userId, refreshToken})
    return token
  }
  async removeToken(refreshToken) {
    const token = await Token.destroy({where: {refreshToken}})
    return token
  }
  validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY)
      return userData      
    }catch {
      return null
    }
  }
  validateAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY)
      return userData
    }catch {
      return null
    }
  }
  async findToken(refreshToken) {
    try {
      const token = await Token.findOne({where: {refreshToken}})
      return token
    }catch(e) {
      return null
    }
  }
}

module.exports = new tokenService()