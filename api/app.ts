import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { APP_HOST, APP_PORT } from './config.ts';
import { withPermissions } from "./auth/middleware.ts";
import * as bookController from './controllers/book.ts';
import * as authController from './controllers/auth.ts';

// Create a new Application and router
const app = new Application();
const apiRouter = new Router({prefix: '/api/v1'});

// Create CRUD paths for books
apiRouter.get('/book/',       withPermissions(['book:read']), bookController.listBooks)
         .get('/book/:id',    withPermissions(['book:read']), bookController.getBook)
         .post('/book/',      withPermissions(['book:write']), bookController.createBook)
         .put('/book/:id',    withPermissions(['book:write']), bookController.updateBook)
         .delete('/book/:id', withPermissions(['book:write']), bookController.deleteBook);

// Create mock auth setup, these are left intentionally open, as the sample app does not implement authentication
apiRouter.get('/auth/claims/:type', authController.requestClaims)
         .patch('/auth/claims/:type', authController.updateClaims);

// Setup application
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

// Start app
const addr = `${APP_HOST}:${APP_PORT}`;
console.log(`Starting server on ${addr}`)
await app.listen(addr);