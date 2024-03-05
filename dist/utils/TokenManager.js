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
Object.defineProperty(exports, "__esModule", { value: true });
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
class TokenManager {
    constructor() {
        this.token = null;
        this.startTokenRefreshInterval();
    }
    static getInstance() {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    }
    /* Checks if token is valid every hour */
    startTokenRefreshInterval() {
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            if (!this.isTokenValid()) {
                try {
                    yield this.refreshToken();
                }
                catch (error) {
                    if (error instanceof Error) {
                        console.log(`Error in refreshing token: ${error.message}`);
                    }
                }
            }
        }), 1000 * 60 * 60);
    }
    setToken(value, expiration) {
        this.token = { value, expiration };
    }
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isTokenValid()) {
                yield this.refreshToken();
            }
            /* Token will be defined since we're refreshing beforehand */
            console.log(`token returned from getToken() : ${this.token}`);
            return this.token;
        });
    }
    isTokenValid() {
        return !!this.token && new Date() < this.token.expiration;
    }
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("https://accounts.spotify.com/api/token", {
                    method: "POST",
                    headers: {
                        Authorization: "Basic " +
                            Buffer.from(client_id + ":" + client_secret).toString("base64"),
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `grant_type=client_credentials`,
                });
                const data = yield response.json();
                if (data.error) {
                    throw new Error(`Failed to fetch access token: ${data.error}}`);
                }
                if (!('access_token' in data) || !('expires_in' in data)) {
                    throw new Error('Invalid response data received, not in format of Spotify Access Token');
                }
                const token = data;
                TokenManager.getInstance().setToken(token.access_token, new Date(Date.now() + token.expires_in * 1000));
                console.log(`token refreshed - its value is ${token.access_token}`);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error in request to access token: ${error.message}`);
                }
            }
        });
    }
}
exports.default = TokenManager;
