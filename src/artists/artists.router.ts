import express, { Router} from "express";

import controller from "./artists.controller";

const router: Router = express.Router();


router.route("/")
        .get(controller.get)

// Export the router to be used in other files
export default router;
