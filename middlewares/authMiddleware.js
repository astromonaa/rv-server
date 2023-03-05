const tokenService = require('../services/tokenService')

module.exports = async function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      next('Unauthorized')
    }
    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) {
      next('Unauthorized')
    }
    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData) {
      next('Unauthorized')
    }
    req.user = userData
    next()
  }catch(e) {
    return e.message
  }
}