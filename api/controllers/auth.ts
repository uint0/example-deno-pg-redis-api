import { cache } from "../util/cache.ts";
import { jwtool } from "../util/jwt.ts";

/**
 * requestClaims
 * Requests claims for a particular type - do not use in production
 * @param params url params
 * @param response Oak HTTP Response 
 */
export async function requestClaims({ params, response }: { params: {type: string}, response: any }) {
    const role = `ROLE_${params.type.toUpperCase()}`;
    const perms = await cache.get(role);

    if(perms === undefined) {
        response.status = 404;
        response.body = {"msg": "No such role"};
    } else {
        response.body = {"token": jwtool.make({role: role})};
    }
}

/**
 * updateClaims
 * Updates claims for a particular role
 * @param params url params
 * @param request Oak HTTP Request
 * @param response Oak HTTP Response 
 */
export async function updateClaims({ params, request, response }: { params: {type: string}, request: any, response: any }) {
    const role = `ROLE_${params.type.toUpperCase()}`;
    const perms = await cache.get(role);

    if(perms === undefined) {
        response.status = 404;
        response.body = {"msg": "No such role"};
    }

    if(!request.hasBody) {
        response.status = 400;
        response.body = { msg: "No data" };
        return;
    }

    const { value: body } = await request.body();
    console.log(body);
    if(!body.hasOwnProperty('claims') || !(body.claims instanceof Array)) {
        response.status = 400;
        response.body = { msg: "Claims missing or invalid" };
        return;
    }

    let permsArr: string[] = (<string>perms).split(',');
    await cache.set(role, [...body.claims, ...permsArr].join(','));
    response.status = 200;
    response.body = { "success": true };
}