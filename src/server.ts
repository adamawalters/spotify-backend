import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import "./db/connection";

const port = process.env.PORT || 5001;
//console.log(connection)

app.listen(port, () => {
  console.log(`[server]: Server listening on port ${port}!`);
});
