
import { Request, Response, NextFunction } from "express";
import TokenManager from "../utils/TokenManager";
const tokenManager = TokenManager.getInstance();
import { ArtistSearchResponse } from "../utils/types";
import  asyncHandler from "../errors/asyncHandler";
import { query, validationResult } from "express-validator";


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


  const validateQueryHasArtistProperties = [ 
    query('artist_search_keyword').exists().withMessage('artist_search_keyword is required'),
    query('offset').exists().withMessage('offset is required').isNumeric().withMessage('offset must be a number'),
  ];


  const handleQueryValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({
        status: 400,
        message: `Validation error`,
        errors: errors.array(),
      });
    }
    // If no errors, then set the properties on res.locals from the query
    for(const key in req.query) { 
      res.locals[key] = req.query[key]
    }

    next();
  };



  export default {
    get: [...validateQueryHasArtistProperties, handleQueryValidationErrors, asyncHandler(get)]
  }