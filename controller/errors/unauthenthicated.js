const CustomAPIError = require('./custom-error');
const {StatusCodes} = require('http-status-codes');


class UnauthenthicatedError extends CustomAPIError {
    constructor(message){//message je error message
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}


module.exports = UnauthenthicatedError;