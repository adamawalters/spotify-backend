import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectToMongoDB } from  "./db/connection";

const port = process.env.PORT || 5001;

async function startServer() {
    try {
        await connectToMongoDB();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Server error:', error);
    }
}

startServer();


