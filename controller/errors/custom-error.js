//6:14

class CustomAPIError extends Error {
    constructor(message,){//message je error message
        super(message);
        // this.statusCode = statusCode;
    }
}

// const createCustomError = (msg,statusCode)=>{//ovog nema 
//     return new CustomAPIError(msg,statusCode);
// };

module.exports = CustomAPIError;
