import { Request, Response, Router } from "express";
import BookService from "../services/bookService";
import HttpErrorHandler from "../utilities/httpErrorHandler";


const bookService: BookService = new BookService();

export async function getAllBooks(req: Request, res: Response) {
    try {
        let result = await bookService.getAll();
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function getBook(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await bookService.getById(id);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function getBookByAuthor(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await bookService.getByAuthor(id);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function createBook(req: Request, res: Response) {
    try {
        let book = req.body;
        let bookCreated = await bookService.create(book);

        if (bookCreated === null) return HttpErrorHandler(res, new Error("Creation failed"), 401);
        res.json(bookCreated);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function updateBook(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let book = req.body;
        let bookUpdated = await bookService.update(id, book);

        if (bookUpdated === null) return HttpErrorHandler(res, new Error("Updated failed"), 401);
        res.json(bookUpdated);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function deleteBook(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await bookService.delete(id);

        if (result === null) return HttpErrorHandler(res, new Error("Delete failed"), 401);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}