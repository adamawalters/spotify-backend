import { Query } from "../../utils/types";
import mongoose from "./../connection";
import data from "./seedQueries.json";
import RecentQuery from "../models/RecentQuery";


startSeed().then(() => mongoose.connection.close())


async function deleteQueries() { 
    //delete all queries from the database
    try {
        console.log(await RecentQuery.deleteMany({}));
    } catch (error) {
        console.error("Error deleting queries", error);
  }
}

async function seedQueries() {  
  //create model for each query in the seedQueries.json file and save it to the database
  const allQueries = data.queries.map(async (query: Query) => {
    const { search_keyword, artist_name, num_songs } = query;
    const recentQuery = new RecentQuery({ search_keyword, artist_name, num_songs });
    await recentQuery.save();
  });

  await Promise.all(allQueries);

  console.log("Queries seeded successfully");
}


async function startSeed() {
  await deleteQueries();
  await seedQueries();
}



