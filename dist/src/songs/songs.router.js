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
const utilities_1 = require("../utils/utilities");
const tokenManager = TokenManager_1.default.getInstance();
const router = express_1.default.Router();
const queryHasSongProperties = (req, res, next) => {
    const { song_search_keyword, artist_name } = req.query;
    if (!song_search_keyword || !artist_name) {
        return next({
            status: 400,
            message: `Query must have 'song_search_keyword' and 'artist_name' properties`,
        });
    }
    res.locals.song_search_keyword = song_search_keyword;
    res.locals.artist_name = artist_name;
    next();
};
router.get("/", queryHasSongProperties, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { song_search_keyword, artist_name } = res.locals;
    const token = yield tokenManager.getToken();
    const params = new URLSearchParams({
        query: `track:"${song_search_keyword}" artist:${artist_name}`,
        type: `track`,
        market: `US`,
        limit: `50`,
    });
    const response = yield fetch(`https://api.spotify.com/v1/search?${params}`, {
        headers: {
            Authorization: `Bearer ${token.value}`,
        },
    });
    const parsedResponse = yield response.json();
    const trackResponse = parsedResponse.tracks;
    while (trackResponse.next) {
        const currResponse = yield fetch(trackResponse.next, {
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        });
        const currParsedResponse = yield currResponse.json();
        const currTrackResponse = currParsedResponse.tracks;
        trackResponse.items.push(...currTrackResponse.items);
        trackResponse.next = currTrackResponse.next;
    }
    const tracksNoDuplicates = (0, utilities_1.removeSongDuplicates)(trackResponse.items);
    res.json({
        data: {
            totalTracks: tracksNoDuplicates.length,
            tracks: tracksNoDuplicates,
        },
    });
}));
// Export the router to be used in other files
exports.default = router;
