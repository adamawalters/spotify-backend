import { Request, Response, NextFunction } from "express";

export function NotFound (req: Request, res: Response, next: NextFunction) {
    next({
      status: 404,
      message: `Path not found: ${req.originalUrl}`
    })
  }