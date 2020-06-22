/**
 * getEnv
 * Tries to fetch a key from deno environment, falling back to defalt if it is not found
 * @param key Key to fetch
 * @param defalt Fallback value
 */
function getEnv(key: string, defalt: string): string {
    return Deno.env.get(key) || defalt;
}

export const APP_HOST = getEnv('APP_HOST', '127.0.0.1');
export const APP_PORT = getEnv('APP_PORT', '5000');

export const DB_USER = getEnv('DB_USER', 'test_poc_books_user');
export const DB_NAME = getEnv('DB_NAME', 'test_poc_books');
export const DB_HOST = getEnv('DB_HOST', '127.0.0.1');
export const DB_PORT = getEnv('DB_PORT', '5432');
export const DB_PASS = getEnv('DB_PASS', 'chickenfarm');

export const CACHE_HOST = getEnv('CACHE_HOST', '127.0.0.1');
export const CACHE_PORT = getEnv('CACHE_PORT', '6379');

export const JWT_SECRET_KEY = getEnv('JWT_SECRET_KEY', 'IAMASECRET');