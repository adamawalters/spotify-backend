import express, { Router} from "express";
import controller from "./songs.controller";

const router: Router = express.Router();


router.route("/")
        .get(controller.get)

export default router;
