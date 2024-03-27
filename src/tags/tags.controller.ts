import { Request, Response, NextFunction } from "express";
import service from "./tags.service";

async function testPost(req: Request, res: Response, next: NextFunction) {
  const { tag_content, query_id } = req.body.data;
  res.json({ data: await service.createTag(tag_content, query_id) });
}

export default {
  post: testPost,
};
