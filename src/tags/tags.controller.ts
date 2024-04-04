import { Request, Response, NextFunction } from "express";
import service from "./tags.service";
import asyncHandler from "../errors/asyncHandler";
import { query, body, param, validationResult } from "express-validator";



async function post(req: Request, res: Response) {
  const { tag_content, query_id } = res.locals;
  res.status(201).json({ data: await service.createTag(tag_content, query_id) });
}

async function update(req: Request, res: Response) {
    const { tag_id, tag_content } = res.locals;
    res.json({data: await service.update(tag_id, tag_content)})
}

async function deleteTag(req: Request, res: Response) {
    const { tag_id } = res.locals;
    await service.delete(tag_id);
    res.sendStatus(204);
}

const postValidations = [
    body('data').exists().withMessage("data property is required").isObject().withMessage("data must be an object"),
    body("data.tag_content").exists().withMessage("tag_content property is required"),
    body("data.query_id").exists().withMessage("query_id property is required"),
    body("data.query_id").custom(service.queryExists)
]

const updateValidations = [
    body('data').exists().withMessage("data property is required").isObject().withMessage("data must be an object"),
    body("data.tag_content").exists().withMessage("tag_content property is required"),
    param("tag_id").exists().withMessage("tag_id property is required").custom(service.tagExists)
]

const deleteValidations = [
    param("tag_id").exists().withMessage("tag_id property is required").custom(service.tagExists)
]



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

export default {
  post: [...postValidations, handleBodyValidationErrors, asyncHandler(post)],
  update: [...updateValidations, handleBodyValidationErrors, handleParamsValidationErrors, asyncHandler(update)],
  delete: [...deleteValidations, handleParamsValidationErrors, asyncHandler(deleteTag)]
};
