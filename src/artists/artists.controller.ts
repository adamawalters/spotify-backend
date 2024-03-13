
import { Request, Response, NextFunction } from "express";
import TokenManager from "../utils/TokenManager";
const tokenManager = TokenManager.getInstance();
import { ArtistSearchResponse } from "../utils/types";


async function get(req: Request, res: Response) {
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

    res.json({
      data: {
        totalArtists: parsedResponse.artists.total,
        artists: responseArtists,
      },
    });
  }


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

  export default {
    get: [queryHasArtistProperties, get]
  }