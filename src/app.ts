import express, { Express, Request, Response } from "express";
const app: Express = express();
import TokenManager from "./utils/TokenManager";
import { ArtistSearchResponse, TrackResponse } from "./utils/types";
import { errorHandler } from "./errors/errorHandler";
import { NotFound } from "./errors/notFound";

/* Body parser */
app.use(express.json())

/* Singleton class that manages Spotify token & refreshes it */
const tokenManager = TokenManager.getInstance()


app.get("/artists", async (req: Request, res: Response) => {
  const { artist_search_keyword } = req.body.data
  const token = await tokenManager.getToken();  

  const params = new URLSearchParams({
    q: artist_search_keyword,
    type: "artist",
    market: "US",
    limit: "10",
  });

  const response = await fetch(
    `https://api.spotify.com/v1/search?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  );

  const parsedResponse: ArtistSearchResponse = await response.json();
  const responseArtists = parsedResponse.artists.items;

  res.json({ data: responseArtists })

});


app.get("/songs", async (req: Request, res: Response) => {
  const { song_search_keyword, artist_name } = req.body.data
  const token = await tokenManager.getToken();  

  const params = new URLSearchParams({
    query: `track:"${song_search_keyword}" artist:${artist_name}`,
    type: `track`,
    market: `US`,
  });

  const response = await fetch(
    `https://api.spotify.com/v1/search?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  );

  const parsedResponse = await response.json();
  const trackResponse: TrackResponse = parsedResponse.tracks;

  res.json({data: trackResponse})

});



app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


app.use(NotFound)
app.use(errorHandler)

export default app;
