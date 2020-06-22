import { makeJwt, Jose, Payload } from "https://deno.land/x/djwt/create.ts";
import { validateJwt } from "https://deno.land/x/djwt/validate.ts";
import { JWT_SECRET_KEY } from "../config.ts";

/**
 * JWTManagers
 * Keeps track of keys for jwt production and validation
 */
class JWTManager {
    #header: Jose;
    #key: string;

    constructor() {
        this.#header = {
            alg: "HS256",
            typ: "JWT"
        }
        this.#key = JWT_SECRET_KEY;
    }

    /**
     * make
     * Make a new JWT
     * @param payload claims the jwt should have
     */
    public make(payload: Payload) {
        return makeJwt({header: this.#header, payload: payload, key: this.#key});
    }

    /**
     * verify
     * Verify the token is valid, returning it if it is
     * @param token string token to verify
     */
    public async verify(token: string) {
        const jwt = await validateJwt(token, this.#key);
        return jwt.isValid ? jwt : null;
    }
}

export const jwtool = new JWTManager();