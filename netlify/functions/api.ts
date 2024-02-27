import express, { Express, Request, Response } from "express";
const api: Express = express();
import cors from "cors";
import serverless from "serverless-http"

/* Body parser */
api.use(express.json())
api.use(cors())


api.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


export const handler = serverless(api)
export default api;
