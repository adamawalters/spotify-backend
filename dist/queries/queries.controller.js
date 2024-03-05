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
const queries_service_1 = __importDefault(require("./queries.service"));
const asyncHandler_1 = __importDefault(require("../errors/asyncHandler"));
function list(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { limit = 0 } = req.query;
        if (isNaN(Number(limit))) {
            next({ status: 400, message: "Limit must be a number" });
        }
        const queries = yield queries_service_1.default.list(Number(limit));
        return res.json({ data: queries });
    });
}
function post(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { search_keyword, artist_name, num_songs } = req.body.data;
        res.json({ data: yield queries_service_1.default.post({ search_keyword, artist_name, num_songs }) });
    });
}
exports.default = {
    list: (0, asyncHandler_1.default)(list),
    post: (0, asyncHandler_1.default)(post),
};
