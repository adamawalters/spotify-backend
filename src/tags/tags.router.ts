import express, { Router} from "express";
import controller from "./tags.controller";

const router: Router = express.Router();


router.route("/")
        .post(controller.post)

export default router;