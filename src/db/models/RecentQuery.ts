import mongoose from "mongoose";
import Tag from "./TagModel";

const querySchema = new mongoose.Schema({
  spotify_id: {
    type: String,
    required: false,
    minLength: 1,
  },
  search_keyword: {
    type: String,
    required: true,
    minLength: 1,
  },
  artist_name: { 
    type: String, 
    required: true,
    minLength: 1,
},
  created_at: {
    type: Date,
    default: () => Date.now(),
    required: true,
    immutable: true,
},
  num_songs: {
    type: Number,
    required: true,
    min: 0,
  },
  tags: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    ref: `tag`,
    default: [],
  },
}, 
);

//creates a collection (table) called "recentQueries" in the database
const model = mongoose.model("recentQuery", querySchema);

export default model;
