import { NextFunction, Request, Response } from "express";
import service from "./queries.service";
import asyncHandler from "../errors/asyncHandler";
import { Query } from "../utils/types";
import { query, body, param, validationResult } from "express-validator";

async function list(req: Request, res: Response) {
  const { limit = 0 } = res.locals;
  const { spotify_id } = res.locals as { spotify_id: number };
  if (spotify_id) {
    const queries = await service.listUserQueries(limit, spotify_id);
    return res.json({ data: queries });
  }
  const queries = await service.listPublicQueries(limit);
  return res.json({ data: queries });
}

async function post(req: Request, res: Response) {
  if (res.locals.spotify_id) {
    const { search_keyword, artist_name, num_songs, spotify_id } =
      res.locals as Required<Query>;
      const response = await service.postUserQuery({  search_keyword, artist_name, num_songs, spotify_id });
    return res.json({ data: response });
  }

  const { search_keyword, artist_name, num_songs } = res.locals as Query;
  res.json({
    data: await service.postPublic({ search_keyword, artist_name, num_songs }),
  });
}

async function deleteUserQuery(req: Request, res: Response) {
  const { queryId } = res.locals
  const response = await service.delete(queryId)
  console.log(`response: ${JSON.stringify(response)}`)
  res.sendStatus(204)
}

const listValidations = [
  query("limit")
    .optional()
    .isNumeric()
    .withMessage("limit must be a number")
    .toInt(),
  query("spotify_id")
    .optional()
    .isNumeric()
    .withMessage("spotify_id must be a number")
    .toInt(),
];

const postValidations = [
  body("data")
    .exists()
    .withMessage("data is required")
    .isObject()
    .withMessage("data must be an object"),
  body("data.spotify_id")
    .optional()
    .isNumeric()
    .withMessage("spotify_id must be a number")
    .toInt(),
  body("data.search_keyword")
    .exists()
    .withMessage("search_keyword is required"),
  body("data.artist_name").exists().withMessage("artist_name is required"),
  body("data.num_songs")
    .exists()
    .withMessage("num_songs is required")
    .isNumeric()
    .withMessage("num_songs must be a number"),
];

const deleteValidations = [
  param("queryId")
    .exists()
    .withMessage("queryId is required in route parameter")
    .custom(service.queryExists)
]

const handleQueryValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 400,
      message: `Validation errors: ${errors
        .array()
        .map((error) => error.msg)
        .join(", ")}`,
    });
  }
  // If no errors, then set the properties on res.locals from the query
  for (const key in req.query) {
    res.locals[key] = req.query[key];
  }

  next();
};

const handleParamsValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 400,
      message: `Validation errors: ${errors
        .array()
        .map((error) => error.msg)
        .join(", ")}`,
    });
  }
  // If no errors, then set the properties on res.locals from the query
  for (const key in req.params) {
    res.locals[key] = req.params[key];
  }

  next();
};

const handleBodyValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 400,
      message: `Validation errors: ${errors
        .array()
        .map((error) => error.msg)
        .join(", ")}`,
    });
  }
  // If no errors, then set the properties on res.locals from the body and query
  for (const key in req.body.data) {
    res.locals[key] = req.body.data[key];
  }

  next();
};


export default {
  list: [...listValidations, handleQueryValidationErrors, asyncHandler(list)],
  post: [...postValidations, handleBodyValidationErrors, asyncHandler(post)],
  delete: [...deleteValidations, handleParamsValidationErrors, asyncHandler(deleteUserQuery)]
};
