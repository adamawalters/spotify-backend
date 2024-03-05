import { NextFunction, Request, Response } from "express";
import service from "./queries.service";
import asyncHandler from "../errors/asyncHandler";
import { Query } from "../utils/types";


async function list(req: Request, res: Response, next: NextFunction) {
    const { limit = 0 } = req.query;
        if(isNaN(Number(limit))) { 
            next({ status: 400, message: "Limit must be a number" })
        }
        const queries = await service.list(Number(limit));
        return res.json({ data: queries });
}


async function post (req: Request, res: Response) {
    const { search_keyword, artist_name, num_songs } = req.body.data as Query;
    res.json({ data: await service.post({ search_keyword, artist_name, num_songs }) });
  }

 export default {
    list: asyncHandler(list),
    post: asyncHandler(post),
 } 