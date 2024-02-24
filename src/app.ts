import express, { Express, Request, Response } from "express";
const app: Express = express();
import { errorHandler } from "./errors/errorHandler";
import { NotFound } from "./errors/notFound";
import SongRouter from "./songs/songs.router"
import ArtistRouter from "./artists/artists.router"

/* Body parser */
app.use(express.json())


app.use("/artists", ArtistRouter)
app.use("/songs", SongRouter)


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


app.use(NotFound)
app.use(errorHandler)

export default app;
