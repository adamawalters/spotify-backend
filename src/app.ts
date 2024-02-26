import express, { Express, Request, Response } from "express";
const app: Express = express();
import { errorHandler } from "./errors/errorHandler";
import { NotFound } from "./errors/notFound";
import SongRouter from "./songs/songs.router"
import ArtistRouter from "./artists/artists.router"
import cors from "cors";

/* Body parser */
app.use(express.json())
app.use(cors())


app.use("/artists", ArtistRouter)
app.use("/songs", SongRouter)


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


app.use(NotFound)
app.use(errorHandler)

export default app;
