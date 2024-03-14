import { NextFunction, Request, Response } from "express";
import service from "./queries.service";
import asyncHandler from "../errors/asyncHandler";
import { Query } from "../utils/types";
import { query, body, validationResult } from "express-validator";

async function list(req: Request, res: Response) {
    const { limit = 0 } = res.locals;
        const queries = await service.list(Number(limit));
        return res.json({ data: queries });
}


async function post (req: Request, res: Response) {
    const { search_keyword, artist_name, num_songs } = req.body.data as Query;
    res.json({ data: await service.post({ search_keyword, artist_name, num_songs }) });
  } 

const listValidations = [
    query('limit').optional().isNumeric().toInt().withMessage('limit must be a number'),
];

const postValidations = [
    body('data').exists().withMessage('data is required').isObject().withMessage('data must be an object'),
    body('data.search_keyword').exists().withMessage('search_keyword is required'),
    body('data.artist_name').exists().withMessage('artist_name is required'),
    body('data.num_songs').exists().withMessage('num_songs is required').isNumeric().withMessage('num_songs must be a number'),
];

const handleQueryValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({
        status: 400,
        message: `Validation errors: ${errors.array().map((error) => error.msg).join(", ")}`,
      });
    }
    // If no errors, then set the properties on res.locals from the query
    for(const key in req.query) { 
      res.locals[key] = req.query[key]
    }

    next();
  };



 export default {
    list: [...listValidations, handleQueryValidationErrors, asyncHandler(list)],
    post: [...postValidations, handleQueryValidationErrors, asyncHandler(post)],
 } 