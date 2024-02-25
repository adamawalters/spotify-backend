import express, { Router, Request, Response, NextFunction } from "express";
import TokenManager from "../utils/TokenManager";
import { ArtistSearchResponse } from "../utils/types";
const tokenManager = TokenManager.getInstance();

// Create an Express router
const router: Router = express.Router();

// Define a middleware function

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

const bodyHasArtistProperties = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { artist_search_keyword, offset } = req.body.data;
  if (!artist_search_keyword || !offset) {
    return next({
      status: 400,
      message: `Body must have 'artist_search_keyword' and 'offset' properties`,
    });
  }
  res.locals.artist_search_keyword = artist_search_keyword;
  res.locals.offset = offset;
  next();
};

// Use the middleware function for a specific route
router.get(
  "/",
  bodyHasDataProperty,
  bodyHasArtistProperties,
  async (req: Request, res: Response) => {
    const { artist_search_keyword, offset } = res.locals;
    const token = await tokenManager.getToken();

    const params = new URLSearchParams({
      q: artist_search_keyword,
      type: "artist",
      market: "US",
      limit: "10",
      offset: offset,
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

    res.json({ data: responseArtists });
  }
);

// Export the router to be used in other files
export default router;
