"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const queries_controller_1 = __importDefault(require("./queries.controller"));
const router = express_1.default.Router();
router.route("/")
    .get(queries_controller_1.default.list)
    .post(queries_controller_1.default.post);
exports.default = router;