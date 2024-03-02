import express, { Router, Request, Response, NextFunction } from "express";
import * as service from "./queries.service";

const router: Router = express.Router();

router.get("/", (req, res, next) => {
    const queries = [
        {
            search_keyword: "Adama Dio From Server",
            artist_name: "Lover",
            date_performed: "02/29/2024",
            num_songs: 40
        },
        {
            search_keyword: "Baby Queen",
            artist_name: "Dream",
            date_performed: "02/29/2024",
            num_songs: 1
        }
    ]

    res.json({data: queries})
})

router.post("/", async (req, res, next) => { 
    //const { search_keyword, artist_name, date_performed, num_songs } = req.body;
    const { search_keyword, artist_name, date_performed, num_songs } =  {
        search_keyword: "Adama Dio From Server",
        artist_name: "Lover",
        date_performed: new Date("02/29/2024"),
        num_songs: 40
    };
    
    res.json(await service.post({ search_keyword, artist_name, date_performed, num_songs }));
    
});


export default router;