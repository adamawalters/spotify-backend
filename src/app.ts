import express, { Express, Request, Response } from "express";
import Buffer from "buffer";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();


app.get("/token", async (req: Request, res: Response) => {

  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.Buffer.from(client_id + ":" + client_secret).toString(
            "base64"
          ),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials`,
    });

    const data = await response.json();

    if (data.error) {
      throw new Error("Failed to fetch access token");
    }

    const token = data //data.access_token
    res.json({
      data: {
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ error: `Internal server error` });
  }
});

app.get("/", (req: Request, res: Response) => {
  
  res.send("Express + TypeScript Server");

});

export default app;
