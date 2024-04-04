import { Query } from "../../utils/types";
import mongoose from "./../connection";
import data from "./seedQueriesData";
import RecentQuery from "../models/RecentQuery";
import { connectToMongoDB } from "./../connection";

async function deleteQueries() { 
    //delete all queries from the database

    await connectToMongoDB();
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
    const { search_keyword, artist_name, num_songs, spotify_id } = query;
   // console.log(`Seeding query: ${search_keyword} - ${artist_name} - ${num_songs} - ${spotify_id}`);
    const recentQuery = new RecentQuery({ search_keyword, artist_name, num_songs, spotify_id });
    return recentQuery.save();
  });

  await Promise.all(allQueries);

  console.log("Queries seeded successfully");
}

deleteQueries();



