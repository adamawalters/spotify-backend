## This is a backend for the TuneTrail App

The TuneTrail app [front-end link](https://github.com/adamawalters/artist-song-keyword-searcher/) explains the purpose of the project & how it works

## Summary

The backend authenticates to the Spotify API using the OAuth2 client credentials authentication flow. It makes the calls to the Spotify API and returns relevant data to the front-end. It also processes the list of songs that are returned by the Spotify API, de-duplicating them based on the ISRC id as well as the beginning of the song name (for example, songs "Name 1" and "Name 1 (Deluxe Edition)" would be considered as the same song).  

The backend stores recent user queries to a MongoDB database via the Mongoose library. These queries are not associated with a particular user unless the user logs in.  Once a user logs in, it also lets users store, edit, and view their own queries which are only visible on their personal profile. This requires the user to log in to Spotify on the frontend so the relevant queries and tags are associated to only that user. Frontend authorization is done via the OAuth2 authorization code with PKCE extension process. 

## Tech stack

This is an Express.js server, currently deployed on [Adaptable](https://spotify-backend.adaptable.app). It contains validation of query parameters, error handling, and not found routes. The MongoDB database is hosted on MongoDB Atlas, and I use the Mongoose library to interact with it.  

## Endpoints
### GET "/artists": 
1. Requires url parameters of keyword and offset, for example, `artists?artist_search_keyword=Celine&offset=0`
2. Will return an object containing a "data" property. This "data" property is an object and the "artists" property of this object contains an array of artists. The "totalArtists" property contains the total number of artists for the full query (only some artists are loaded initially)

### GET "/songs": 
1. Requires url parameters of artist name, for example, `songs?song_search_keyword=Love&artist_name=Celine+Dion`
2. Will return an object containing a "data" property. This "data" property is an object and the "tracks" property of this object contains an array of songs. The "totalTracks" property contains the total number of songs for the query. 

### GET "/queries": 
1. Optionally takes into account the url parameter to limit queries, for example, `queries?limit=3`. The limit is optional and if left out will return all recent queries. 
2. Will return an object containing a "data" property. This "data" property is an array of objects that represent a search query, with properties  `search_keyword`, `artist_name`, `num_songs`, and `created_at`.   

### POST "/queries":
1. Requires body to be an object with a "data" property. This "data" property is an object with the properties `search_keyword`, `artist_name`, and `num_songs`. The body can also optionally take a spotify_id, in the case that a user is saving a query to their personal profile.
2. Will return an object containing a "data" property. This "data" property is am object that represents a search query, with properties  `search_keyword`, `artist_name`, `num_songs`, `_id`, `created_at`, and potentially `spotify_id` if that was present in the body. 

### DELETE "/queries/:queryId":
1. Requires queryId to be present in the route parameter.
2. Will return a status of `204 No Content` if delete is successful.

### POST "/tags":
1. Requires body to be an object with a "data" property. This "data" property is an object with the properties `tag_content` and `query_id`. The tag always will be associated with an existing query.
2. Will return an object with a data property containing the properties "_id", "tag_content", and "query_id".

### PUT "/tags/:tagId":
1. Requires tagId to be present in the route parameter.
2. Requires body to be an object with a "data" property. This "data" property is an object with the property `tag_content`.
3. Will return an object with a data property containing the properties "_id", "tag_content", and "query_id".

### DELETE "/tags/:tagId":
1. Requires tagId to be present in the route parameter.
2. Will return a status of `204 No Content` if delete is successful.
