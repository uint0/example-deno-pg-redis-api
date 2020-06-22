import { database } from "../util/database.ts";

/**
 * listBooks
 * Lists all books in the repo
 * @auth books:read
 * @param response Oak HTTP Response
 */
export async function listBooks({ response }: { response: any }) {
    const { rows: books } = await database.query(
        "SELECT b.id, b.name, a.name FROM book b INNER JOIN author a ON a.id = b.author_id"
    );

    response.body = books.map(row => ({id: row[0], title: row[1], author: row[2]}));
}

/**
 * getBook
 * Gets a particular book by id, responds 404 if book not found
 * @auth book:read
 * @param params url params
 * @param response Oak HTTP REsponse
 */
export async function getBook({ params, response }: { params: {id: string}, response: any }) {
    const { rows: book } = await database.query(
        "SELECT b.name, a.name FROM book b INNER JOIN author a ON a.id = b.author_id WHERE b.id=$1",
        params.id
    );

    if(book.length == 0) {
        response.status = 404;
        response.body = { msg: "Error book not found" };
    } else {
        const bookInfo = book[0];
        response.body = {title: bookInfo[0], author: bookInfo[1]};
    }
}

/**
 * createBook
 * Creates a new book from a title and author
 * @auth book:write
 * @param request Oak HTTP Request
 * @param response Oak HTTP Response
 */
export async function createBook({ request, response }: { request: any, response: any }) {
    if(!request.hasBody) {
        response.status = 400;
        response.body = { msg: "No data" };
        return;
    }

    const { value: body } = await request.body();
    if(!body.hasOwnProperty('title') || !body.hasOwnProperty('author')) {
        response.status = 400;
        response.body = { msg: "Creation requires title and author" };
        return;
    }

    const { rows: author } = await database.query("SELECT id FROM author WHERE name=$1", body.author);
    let authorId;
    if(author.length == 0) {
        const { rows: newAuthorId }= await database.query("INSERT INTO author(name) VALUES ($1) RETURNING id", body.author);
        authorId = newAuthorId[0][0];
    } else {
        authorId = author[0][0];
    }

    let { rows: newBookId } = await database.query("INSERT INTO book(name, author_id) VALUES ($1, $2) RETURNING id", body.title, authorId);

    response.body = {"id": newBookId[0][0]};
}

// ---------------
// Not Implemented
// ---------------

export async function updateBook({ params, request, response }: { params: {id: string}, request: any, response: any }) {
    response.status = 501;
    response.body = {"msg": "Not implemented"};
}

export async function deleteBook({ params, response }: { params: {id: string}, response: any }) {
    response.status = 501;
    response.body = {"msg": "Not implemented"};
}