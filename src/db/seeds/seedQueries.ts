import { Query } from "../../utils/types";
import mongoose from "./../connection";
import data from "./seedQueriesData";
import RecentQuery from "../models/RecentQuery";

async function deleteQueries() { 
    //delete all queries from the database
    try {
        console.log(await RecentQuery.deleteMany({}));
        await seedQueries();
    } catch (error) {
        console.error("Error deleting queries", error);
    } finally {
        mongoose.connection.close();
    }
}

async function seedQueries() {  
  //create model for each query in the seedQueries.json file and save it to the database
  const allQueries = data.map(async (query: Query) => {
    const { search_keyword, artist_name, num_songs } = query;
    const recentQuery = new RecentQuery({ search_keyword, artist_name, num_songs });
    await recentQuery.save();
  });

  await Promise.all(allQueries);

  console.log("Queries seeded successfully");
}

deleteQueries();



