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
const connection_1 = __importDefault(require("./../connection"));
const seedQueriesData_1 = __importDefault(require("./seedQueriesData"));
const RecentQuery_1 = __importDefault(require("../models/RecentQuery"));
startSeed().then(() => connection_1.default.connection.close());
function deleteQueries() {
    return __awaiter(this, void 0, void 0, function* () {
        //delete all queries from the database
        try {
            console.log(yield RecentQuery_1.default.deleteMany({}));
        }
        catch (error) {
            console.error("Error deleting queries", error);
        }
    });
}
function seedQueries() {
    return __awaiter(this, void 0, void 0, function* () {
        //create model for each query in the seedQueries.json file and save it to the database
        const allQueries = seedQueriesData_1.default.map((query) => __awaiter(this, void 0, void 0, function* () {
            const { search_keyword, artist_name, num_songs } = query;
            const recentQuery = new RecentQuery_1.default({ search_keyword, artist_name, num_songs });
            yield recentQuery.save();
        }));
        yield Promise.all(allQueries);
        console.log("Queries seeded successfully");
    });
}
function startSeed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield deleteQueries();
        yield seedQueries();
    });
}
