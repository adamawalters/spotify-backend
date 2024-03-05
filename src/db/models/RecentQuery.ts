import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
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
}, {capped: {size: 1024, max: 100}});

const model = mongoose.model("recentQuery", querySchema);

export default model;
