"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const errorHandler_1 = require("./errors/errorHandler");
const notFound_1 = require("./errors/notFound");
const songs_router_1 = __importDefault(require("./songs/songs.router"));
const artists_router_1 = __importDefault(require("./artists/artists.router"));
//import QueriesRouter from "./queries/queries.router"
const cors_1 = __importDefault(require("cors"));
const serverless_http_1 = __importDefault(require("serverless-http"));
/* Body parser */
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/artists", artists_router_1.default);
app.use("/songs", songs_router_1.default);
//app.use("/queries", QueriesRouter)
app.get("/", (_req, res) => {
    res.send("Express + TypeScript Server");
});
app.use(notFound_1.NotFound);
app.use(errorHandler_1.errorHandler);
exports.handler = (0, serverless_http_1.default)(app);
exports.default = app;
