import RecentQuery from "../db/models/RecentQuery";
import { Query } from "../utils/types";

// Returns public queries (ones which don't have a spotify_id)
async function listPublicQueries(limit: number = 0) {
  return await RecentQuery.find({spotify_id: null})
    .sort({ created_at: -1 })
    .limit(limit);
}

async function listUserQueries(limit: number = 0, spotify_id: number) { 
  return await RecentQuery.find({spotify_id: spotify_id})
    .sort({ created_at: -1 })
    .limit(limit);
}

async function postPublic(query: Query) {
  const { search_keyword, artist_name, num_songs } = query;
  const recentQuery = new RecentQuery({ search_keyword, artist_name, num_songs });
  return await recentQuery.save();
}

async function postUserQuery(query: Required<Query>) {  
  const { search_keyword, artist_name, num_songs, spotify_id } = query;
  const recentQuery = new RecentQuery({ search_keyword, artist_name, num_songs, spotify_id });
  return await recentQuery.save();
}

export default {
  listUserQueries,
  listPublicQueries,
  postPublic,
  postUserQuery,
};
