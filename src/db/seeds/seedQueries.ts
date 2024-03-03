import { Query } from "../../utils/types";
import mongoose from "./../connection";
import data from "./seedQueries.json";
import QueryModel from "../models/QueryModel";




await startSeed();
mongoose.connection.close();



async function deleteQueries() { 
    //delete all queries from the database
    try {
        console.log(await QueryModel.deleteMany({}));
    } catch (error) {
        console.error("Error deleting queries", error);
  }
}

async function seedQueries() {  
  //create model for each query in the seedQueries.json file and save it to the database
  const allQueries = data.queries.map(async (query: Query) => {
    const { search_keyword, artist_name, num_songs } = query;
    const queryModel = new QueryModel({ search_keyword, artist_name, num_songs });
    await queryModel.save();
  });

  await Promise.all(allQueries);

  console.log("Queries seeded successfully");
}


async function startSeed() {
  await deleteQueries();
  await seedQueries();
}



