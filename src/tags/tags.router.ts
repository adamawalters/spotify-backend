import express, { Router} from "express";
import controller from "./tags.controller";

const router: Router = express.Router();


router.route("/")
        .post(controller.post)

router.route("/:tag_id")
        .put(controller.update)
        .delete(controller.delete)

export default router;