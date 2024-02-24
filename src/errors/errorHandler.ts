import { CustomError } from "../utils/types";
import { Request, Response, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler (error: CustomError, req: Request, res: Response, _next: NextFunction) {
    console.error(JSON.stringify(error.message));
    const { status = 500, message = "Something went wrong! "} = error
    res.status(status).json({error: message})
  }