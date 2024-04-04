import { Token, SpotifyAccessToken } from "./types";
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

export default class TokenManager {
    private static instance: TokenManager;
    private token: Token | null = null;

    private constructor() {
    }

    public static getInstance(): TokenManager {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    } 
 

    public setToken(value: string, expiration: Date): void {
        this.token = { value, expiration };
    }

    public async getToken(): Promise<Token> {
        if(!this.isTokenValid()) {
            await this.refreshToken()
        }
        /* Token will be defined since we're refreshing beforehand */
        return this.token!;
    }

    public isTokenValid(): boolean {
        return !!this.token && new Date() < this.token.expiration;
    }

    public async refreshToken(): Promise<void> {
        try {
            const response = await fetch("https://accounts.spotify.com/api/token", {
              method: "POST",
              headers: {
                Authorization:
                  "Basic " +
                  Buffer.from(client_id + ":" + client_secret).toString(
                    "base64"
                  ),
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: `grant_type=client_credentials`,
            });
        
            const data = await response.json();
            
            if (data.error) {
              throw new Error(`Failed to fetch access token: ${data.error}}. Contact support.`);
            }

            if (!('access_token' in data) || !('expires_in' in data)) {
                throw new Error('Issue with properties in Spotify Access Token. Contact support.');
            }
        
            const token: SpotifyAccessToken = data; 
            TokenManager.getInstance().setToken(token.access_token, new Date(Date.now() + token.expires_in * 1000));    
            console.log(`token refreshed - its value is ${token.access_token}`)        
        
          } catch (error) {
            if(error instanceof Error) {
                throw error;
            }
          }
    }

}