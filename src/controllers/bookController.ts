import { Request, Response, Router } from "express";
import { env } from "process";
import BookRepository from "../repositories/bookRepository";
import HttpErrorHandler from "../utilities/httpErrorHandler";


const bookRepository: BookRepository = new BookRepository();

export async function getAllBooks(req: Request, res: Response) {
    try {
        let page = null;
        if (req.query.page) page = parseInt(req.query.page as string);
        else page = 1;

        let limit = null;
        if (req.query.limit) limit = parseInt(req.query.limit as string);
        else limit = 20;

        let result = await bookRepository.getAll(page, limit);
        if(!result.ok) res.status(403);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function getBook(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await bookRepository.getById(id);
        if (result === null) return res.send("Book not found");
        if(!result.ok) res.status(403);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function getBookByAuthor(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await bookRepository.getByAuthor(id);
        if(!result.ok) res.status(403);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function getBookByTitle(req: Request, res: Response) {
    try {
        let title: string = req.params.title;
        let result = await bookRepository.getByTitle(title);
        if(!result.ok) res.status(403);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function getBookByCategory(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let page = null;
        if (req.query.page) page = parseInt(req.query.page as string);
        else page = 1;

        let limit = null;
        if (req.query.limit) limit = parseInt(req.query.limit as string);
        else limit = 20;

        let result = await bookRepository.getByCategory(id, page, limit);
        if(!result.ok) res.status(403);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function createBook(req: Request, res: Response) {
    try {
        let book = req.body;
        let listFiles: any = req.files;

        let poster = null;
        let document = null;
        if (listFiles){
            poster = listFiles?.['poster']?.[0];
            document = listFiles?.['document']?.[0];
        }

        // confguracion de la ruta del poster
        if (poster) {
            let urlPoster = null;
            urlPoster = `${env.APP_URL}/${poster?.filename}`;
            req.body.poster = urlPoster;
        }
        else req.body.poster = "";

        // confguracion de la ruta del file
        if (document) {
            let urlDocument = null;
            urlDocument = `${env.APP_URL}/${document?.filename}`;
            req.body.document = urlDocument;
        }
        else req.body.document = "";

        let bookCreated = await bookRepository.create(book);

        if (!bookCreated.ok) res.status(403);
        res.json(bookCreated);
    } catch (err: any) {

        return HttpErrorHandler(res, err);
    }
}

export async function updateBook(req: Request, res: Response) {
    try {
        let book = req.body;
        let id = req.params.id;
        let listFiles: any = req.files;

        let poster = null;
        let document = null;
        if (listFiles){
            poster = listFiles?.['poster']?.[0];
            document = listFiles?.['document']?.[0];
        }

        // confguracion de la ruta del poster
        if (poster) {
            let urlPoster = null;
            urlPoster = `${env.APP_URL}/${poster?.filename}`;
            req.body.poster = urlPoster;
        }
        else req.body.poster = "";

        // confguracion de la ruta del file
        if (document) {
            let urlDocument = null;
            urlDocument = `${env.APP_URL}/${document?.filename}`;
            req.body.document = urlDocument;
        }
        else req.body.document = "";

        let bookUpdated = await bookRepository.update(id, book);

        if (!bookUpdated.ok) res.status(403);
        res.json(bookUpdated);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function deleteBook(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await bookRepository.delete(id);
        if(!result.ok) res.status(403);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}