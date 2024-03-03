import { Request, Response, NextFunction } from 'express';

// This function takes a middleware function and returns a new function that catches any errors and passes them to the next function.
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise <void | Response>) => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };

export default asyncHandler;