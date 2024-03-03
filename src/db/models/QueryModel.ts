import mongoose from "mongoose";

const querySchema = new mongoose.Schema(
  {
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
  },
  { capped: {size: 1024, max: 100} }
);

// Create a model for the query schema - this automatically creates a collection named "recentQueries" in the database
// The collection is capped at 1024 bytes and can store a maximum of 100 documents
const model = mongoose.model("recentQuery", querySchema);

export default model;
