import mongoose from "mongoose";

const querySchema = new mongoose.Schema({ 
    search_keyword: String, 
    artist_name: String,
    date_performed: Date,
    num_songs: Number 
});

const model = mongoose.model("Query", querySchema);

export default model;