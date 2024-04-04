import { Request, Response, NextFunction } from 'express';


//This function invokes the function I pass into it with this function's own req, res, next objects in a try/catch and sends any error to the error handler
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise <void | Response>) => 
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            await fn(request, response, next);
        } catch (error) {
            next(error);
        }
    };

export default asyncHandler;