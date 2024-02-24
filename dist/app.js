"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const TokenManager_1 = __importDefault(require("./utils/TokenManager"));
const errorHandler_1 = require("./errors/errorHandler");
const notFound_1 = require("./errors/notFound");
/* Body parser */
app.use(express_1.default.json());
/* Singleton class that manages Spotify token & refreshes it */
const tokenManager = TokenManager_1.default.getInstance();
app.get("/artists", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { artist_search_keyword } = req.body.data;
    const token = yield tokenManager.getToken();
    const params = new URLSearchParams({
        q: artist_search_keyword,
        type: "artist",
        market: "US",
        limit: "10",
    });
    const response = yield fetch(`https://api.spotify.com/v1/search?${params}`, {
        headers: {
            Authorization: `Bearer ${token.value}`,
        },
    });
    const parsedResponse = yield response.json();
    const responseArtists = parsedResponse.artists.items;
    res.json({ data: responseArtists });
}));
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.use(notFound_1.NotFound);
app.use(errorHandler_1.errorHandler);
exports.default = app;
