import express, { Router, Request, Response, NextFunction } from "express";
import TokenManager from "../utils/TokenManager";
import { ArtistSearchResponse } from "../utils/types";
const tokenManager = TokenManager.getInstance();

// Create an Express router
const router: Router = express.Router();

// Define a middleware function


const queryHasArtistProperties = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { artist_search_keyword, offset } = req.query;
  if (!artist_search_keyword /*|| typeof offset !== "number"*/) {
    return next({
      status: 400,
      message: `query must have 'artist_search_keyword' and 'offset' (as a number) properties`,
    });
  }
  res.locals.artist_search_keyword = artist_search_keyword;
  res.locals.offset = offset;
  next();
};

// Use the middleware function for a specific route
router.get(
  "/",
  queryHasArtistProperties,
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

    console.log(`Token.value right before request is ${token.value}`)

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

    res.json({
      data: {
        totalArtists: parsedResponse.artists.total,
        artists: responseArtists,
      },
    });
  }
);

// Export the router to be used in other files
export default router;
