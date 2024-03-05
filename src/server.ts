import dotenv from "dotenv";
dotenv.config();
import app from "./app";
//import { connectToMongoDB } from  "./db/connection";

const port = process.env.PORT || 5001;
 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

