const asyncWrapper = (fn) =>{// da zamnjeni try/catch blokove zbog redudantnosti koda
    return async (req,res,next)=>{
        try {
            await fn(req,res,next);
        } catch (error) {
            next(error);//proslijedi drugom midleware
        }
    };
    };
    
    module.exports = asyncWrapper;