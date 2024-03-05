"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const querySchema = new mongoose_1.default.Schema({
    search_keyword: {
        type: String,
        required: true,
        minLength: 1,
    },
    artist_name: {
        type: String,
        required: true,
        minLength: 1,
    },
    created_at: {
        type: Date,
        default: () => Date.now(),
        required: true,
        immutable: true,
    },
    num_songs: {
        type: Number,
        required: true,
        min: 0,
    },
}, { capped: { size: 1024, max: 100 } });
// Create a model for the query schema - this automatically creates a collection named "recentQueries" in the database
// The collection is capped at 1024 bytes and can store a maximum of 100 documents
const model = mongoose_1.default.model("recentQuery", querySchema);
exports.default = model;
