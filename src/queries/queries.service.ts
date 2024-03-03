import QueryModel from "../db/models/QueryModel";
import { Query } from "../utils/types";

async function list(limit: number = 0) {
  return await QueryModel.find().sort({ created_at: -1 }).limit(limit);
}

async function post(query: Query) {
  const { search_keyword, artist_name, num_songs } = query;
  const queryModel = new QueryModel({ search_keyword, artist_name, num_songs });
  return await queryModel.save();
}

export default {
  list,
  post,
};
