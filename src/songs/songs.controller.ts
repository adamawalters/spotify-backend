import { Request, Response, NextFunction, RequestHandler } from 'express';
import TokenManager from '../utils/TokenManager';
import { TrackResponse } from '../utils/types';
import { fetchAllSongs, removeSongDuplicates } from '../utils/utilities';
const tokenManager = TokenManager.getInstance();
import asyncHandler from '../errors/asyncHandler';
import {query, validationResult} from 'express-validator';



  async function get(req: Request, res: Response) {
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
    const trackResponseWithAllTracks = await fetchAllSongs(trackResponse)
    const tracksNoDuplicates = removeSongDuplicates(trackResponseWithAllTracks.items);

    res.json({
      data: {
        totalTracks: tracksNoDuplicates.length,
        tracks: tracksNoDuplicates,
      },
    });
  }


  // Checking if properties are present in the query. To check in general through params, body, and query, use check() instead of query()
  const validateQueryHasSongProperties = [
    query(`song_search_keyword`).exists().notEmpty().withMessage(`song_search_keyword is required`),
    query(`artist_name`).exists().notEmpty().withMessage(`artist_name is required`),
  ]

  const handleQueryValidationErrors = (req: Request, res: Response, next: NextFunction) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({
        status: 400,
        message: `Validation errors: ${errors.array().map((error) => error.msg).join(", ")}`,
      });
    }
    // If no errors, then set the properties on res.locals from the query
    for (const key in req.query) {
      res.locals[key] = req.query[key];
    }

    next();
  }



  export default {
    get: [...validateQueryHasSongProperties, handleQueryValidationErrors, asyncHandler(get)]
  }