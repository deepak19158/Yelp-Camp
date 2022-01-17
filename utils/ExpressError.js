class ExpressError extends Error {
    constructor(message, statuscode) {
        super();
        this.message = message;
        this.statusCode = statuscode;
    }
}
module.exports = ExpressError