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
const TokenManager_1 = __importDefault(require("../utils/TokenManager"));
const tokenManager = TokenManager_1.default.getInstance();
// Create an Express router
const router = express_1.default.Router();
// Define a middleware function
const queryHasArtistProperties = (req, res, next) => {
    const { artist_search_keyword, offset } = req.query;
    if (!artist_search_keyword /*|| typeof offset !== "number"*/) {
        return next({
            status: 400,
            message: `query must have 'artist_search_keyword' and 'offset' (as a number) properties`,
        });
    }
    res.locals.artist_search_keyword = artist_search_keyword;
    res.locals.offset = offset;
    next();
};
// Use the middleware function for a specific route
router.get("/", queryHasArtistProperties, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { artist_search_keyword, offset } = res.locals;
    const token = yield tokenManager.getToken();
    const params = new URLSearchParams({
        q: artist_search_keyword,
        type: "artist",
        market: "US",
        limit: "10",
        offset: offset,
    });
    console.log(`Token.value right before request is ${token.value}`);
    const response = yield fetch(`https://api.spotify.com/v1/search?${params}`, {
        headers: {
            Authorization: `Bearer ${token.value}`,
        },
    });
    const parsedResponse = yield response.json();
    const responseArtists = parsedResponse.artists.items;
    res.json({
        data: {
            totalArtists: parsedResponse.artists.total,
            artists: responseArtists,
        },
    });
}));
// Export the router to be used in other files
exports.default = router;
