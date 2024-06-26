import express, { Express, Request, Response } from "express";
const app: Express = express();
import { errorHandler } from "./errors/errorHandler";
import { NotFound } from "./errors/notFound";
import SongRouter from "./songs/songs.router"
import ArtistRouter from "./artists/artists.router"
import QueriesRouter from "./queries/queries.router"
import cors from "cors";
import serverless from "serverless-http"
import TagsRouter from "./tags/tags.router"

/* Body parser */
app.use(express.json())
app.use(cors())


app.use("/artists", ArtistRouter)
app.use("/songs", SongRouter)
app.use("/queries", QueriesRouter)
app.use("/tags", TagsRouter)


app.get("/", (_req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
}); 


app.use(NotFound)
app.use(errorHandler)

export const handler = serverless(app)
export default app;
