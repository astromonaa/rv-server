module.exports =  class ApiError extends Error {
  status;
  constructor(status, message) {
    super(message)
    this.status = status
  }
  static badRequest(message) {
    return new ApiError(400, message)
  }
  static internal(message) {
    return new ApiError(500, message)
  }
  static forbiden(message) {
    return new ApiError(403, message)
  }
}