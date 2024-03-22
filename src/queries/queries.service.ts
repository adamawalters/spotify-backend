import RecentQuery from "../db/models/RecentQuery";
import { Query } from "../utils/types";

// Returns public queries (don't have a spotify_id)
async function list(limit: number = 0) {
  return await RecentQuery.find({spotify_id: null})
    .sort({ created_at: -1 })
    .limit(limit);
}

async function post(query: Query) {
  const { search_keyword, artist_name, num_songs } = query;
  const recentQuery = new RecentQuery({ search_keyword, artist_name, num_songs });
  return await recentQuery.save();
}

export default {
  list,
  post,
};
