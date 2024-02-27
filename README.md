## This is a back-end for the TuneTrail App

The TuneTrail app [front-end link](https://github.com/adamawalters/artist-song-keyword-searcher/) explains the purpose of the project & how it works

## Tech stack

This is an Express.js server, currently deployed on [Netlify](https://spotify-backend-express.netlify.app/) as a serverless function. It contains validation of query parameters, error handling, and not found routes. 

## Endpoints
###GET "/artists": requires url parameters of keyword and offset, for example, `artists?artist_search_keyword=Celine&offset=0`
1. Will return an object containing a "data" property. This "data" property is an object and the "artists" property of this object contains an array of artists. The "totalArtists" property contains the total number of artists for the full query (only some artists are loaded initially)

###GET "/songs": requires url parameters of artist name, for example, `songs?song_search_keyword=Love&artist_name=C%C3%A9line+Dion`
1. Will return an object containing a "data" property. This "data" property is an object and the "tracks" property of this object contains an array of songs. The "totalTracks" property contains the total number of songs for the query. 

  


