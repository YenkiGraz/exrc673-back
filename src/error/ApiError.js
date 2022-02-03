class ApiError extends Error {
    constructor(code, message) {
        super();
        this.code = code;
        this.message = message;
    }

    static BadRequest(msg) {
        return new ApiError(400, msg)
    }

    static InternalError(msg) {
        return new ApiError(500, msg)
    }
}

module.exports = ApiError