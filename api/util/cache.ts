import { connect, Redis } from "https://denopkg.com/keroxp/deno-redis/mod.ts";
import { CACHE_HOST, CACHE_PORT } from "../config.ts";

/**
 * Cache
 * Keeps track of a single redis connection
 * Provides methods to set and get keys
 */
class Cache {
    #client!: Redis;

    constructor() {
        this.connect();
    }

    /**
     * connect
     * Creates a redis connection
     */
    public async connect() {
        this.#client = await connect({
            hostname: CACHE_HOST,
            port: +CACHE_PORT
        });
    }

    /**
     * set
     * Sets a key to a value
     * @param key Key to set
     * @param value Value to set key to
     */
    public async set(key: string, value: string) {
        this.#client.set(key, value);
    }

    /**
     * get
     * Gets a value from the cache
     * @param key key of the value to get
     * @returns Promise to obtain the value, undefined if the key is not found
     */
    public async get(key: string): Promise<string | undefined> {
        return this.#client.get(key);
    }
}

export const cache = new Cache();
