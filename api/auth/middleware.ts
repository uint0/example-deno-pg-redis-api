import { RouterMiddleware } from "https://deno.land/x/oak/mod.ts";
import { Context } from "https://deno.land/x/oak/context.ts";
import { jwtool } from "../util/jwt.ts";
import { cache } from "../util/cache.ts";

/**
 * getRequestToken
 * Attempts to fetch a JWT out of the oak request context, returns null on failure
 * @param ctx Oak Request Context
 */
async function getRequestToken(ctx: Context) {
    const token = ctx.request.headers.get('X-Api-Token')
    if(token === null) {
        ctx.response.status = 401;
        ctx.response.body = {"msg": "Please obtain a authorization token"};
        return null;
    }

    const jwt = await jwtool.verify(token);
    if(jwt === null) {
        ctx.response.status = 400;
        ctx.response.body = {"msg": "Your token is invalid"};
        return null;
    }

    return jwt;
}

/**
 * withPermissions
 * A router middleware to only execute subsequent handlers if the request has one of a list of specified permissions
 * @param perms Permissions to check for
 */
export function withPermissions(perms: string[] | null): RouterMiddleware {
    return async (ctx: Context, next: () => Promise<void>) => {
        if(perms === null) {
            await next();
            return;
        }

        const jwt = await getRequestToken(ctx);
        if(jwt === null) {
            return;
        }

        const role = <string>jwt.payload?.role;
        const rolePerms = (await cache.get(role))?.split(',')!;

        if(!rolePerms.some(perm => perms.includes(perm))) {
            ctx.response.status = 403;
            ctx.response.body = {"msg": "Forbidden"};
            return;
        }

        await next();
    };
}