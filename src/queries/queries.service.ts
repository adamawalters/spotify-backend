import QueryModel from "./QueryModel"
import { Query } from "../utils/types";

export async function post(query: Query) {

        const { search_keyword, artist_name, date_performed, num_songs } = query;
        const newQuery = new QueryModel({ search_keyword, artist_name, date_performed, num_songs });
        return await newQuery.save();

}

