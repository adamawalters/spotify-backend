import express, { Router, Request, Response, NextFunction } from "express";
import TokenManager from "../utils/TokenManager";
import { TrackResponse } from "../utils/types";
import { removeSongDuplicates } from "../utils/utilities";
const tokenManager = TokenManager.getInstance();

const router: Router = express.Router();

const bodyHasDataProperty = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { data } = req.body;
  if (!data) {
    return next({
      status: 400,
      message: `Body must have 'data' property`,
    });
  }
  next();
};

const bodyHasSongProperties = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { song_search_keyword, artist_name } = req.body.data;
  if (!song_search_keyword || !artist_name) {
    return next({
      status: 400,
      message: `Body must have 'song_search_keyword' and 'artist_name' properties`,
    });
  }
  res.locals.song_search_keyword = song_search_keyword;
  res.locals.artist_name = artist_name

  next();
};

router.get(
  "/",
  bodyHasDataProperty,
  bodyHasSongProperties,
  async (req: Request, res: Response) => {
    const { song_search_keyword, artist_name } = res.locals;
    const token = await tokenManager.getToken();

    const params = new URLSearchParams({
      query: `track:"${song_search_keyword}" artist:${artist_name}`,
      type: `track`,
      market: `US`,
      limit: `50`,
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

    while (trackResponse.next) {
      const currResponse = await fetch(trackResponse.next, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      const currParsedResponse = await currResponse.json();
      const currTrackResponse: TrackResponse = currParsedResponse.tracks;

      trackResponse.items.push(...currTrackResponse.items);
      trackResponse.next = currTrackResponse.next;
    }

    const tracksNoDuplicates = removeSongDuplicates(trackResponse.items);

    res.json({
      data: { numTracks: tracksNoDuplicates.length, tracks: tracksNoDuplicates },
    });
  }
);

// Export the router to be used in other files
export default router;
