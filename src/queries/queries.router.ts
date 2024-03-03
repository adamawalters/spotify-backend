import express, { Router } from "express";
import controller from "./queries.controller";


const router: Router = express.Router();

router.route("/")
    .get(controller.list)   
    .post(controller.post)

            

export default router;
