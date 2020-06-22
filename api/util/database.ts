import { Client } from "https://deno.land/x/postgres/mod.ts";
import { DB_USER, DB_NAME, DB_HOST, DB_PASS, DB_PORT } from "../config.ts";

/**
 * Database
 * Keeps track of a single database connection
 */
class Database {
    #client: Client;

    constructor() {
        this.#client = new Client({
            user: DB_USER,
            password: DB_PASS,
            database: DB_NAME,
            hostname: DB_HOST,
            port: +DB_PORT
        });

        this.connect();
    }

    /**
     * connect
     * Connects the client to the database
     */
    public async connect(): Promise<void> {
        await this.#client.connect();
    }

    /**
     * query
     * Performs a query on the database
     * @param query query to execute
     * @param args arguments for the query
     */
    public async query(query: string, ...args: any[]) {
        return this.#client.query(query, ...args);
    }
}

export const database = new Database();