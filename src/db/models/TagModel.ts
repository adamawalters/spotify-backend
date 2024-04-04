import mongoose from "mongoose";
import RecentQuery from "./RecentQuery"

const tagSchema = new mongoose.Schema({
  tag_content: {
    type: String,
    required: true,
    minLength: 1,
  },
  query_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: `RecentQuery`,
    validate: {
      validator: async function(query_id: string) {
        // Check if the query_id exists in the RecentQuery collection
        const query = await RecentQuery.findById(query_id);
        return !!query; // return true if the query exists, false otherwise
      },
      message: 'No RecentQuery found with this id'
    }
  },
}, 
);

//creates a collection (table) called "tags" in the database
const model = mongoose.model("tag", tagSchema);

export default model;
