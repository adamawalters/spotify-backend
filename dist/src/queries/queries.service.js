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
const RecentQuery_1 = __importDefault(require("../db/models/RecentQuery"));
function list(limit = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield RecentQuery_1.default.find().sort({ created_at: -1 }).limit(limit);
    });
}
function post(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const { search_keyword, artist_name, num_songs } = query;
        const recentQuery = new RecentQuery_1.default({ search_keyword, artist_name, num_songs });
        return yield recentQuery.save();
    });
}
exports.default = {
    list,
    post,
};
