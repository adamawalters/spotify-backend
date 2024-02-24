import app from "./app"
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`[server]: Server listening on port ${port}!`);
  });