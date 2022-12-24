import { Request, Response } from "express";
import Author from "../interfaces/Author";
import AuthorService from "../services/authorService";
import HttpErrorHandler from "../utilities/httpErrorHandler";

const authorService: AuthorService = new AuthorService();


export async function getAllAuthors(req: Request, res: Response) {
    try {
        let result = await authorService.getAll();
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function getAuthor(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await authorService.getById(id);
        if(result === null) HttpErrorHandler(res, new Error("Author not found"), 404);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function createAuthor(req: Request, res: Response) {
    try {
        let author = req.body;
        let authorCreated = await authorService.create(author);

        if (authorCreated === null) return HttpErrorHandler(res, new Error("Creation falied"), 401);
        res.json(authorCreated);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function updateAuthor(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let author = req.body;
        let authorUpdated = await authorService.update(id, author);

        if (authorUpdated === null) return HttpErrorHandler(res, new Error("Updated failed"), 401);
        res.json(authorUpdated);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function deleteAuthor(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await authorService.delete(id);

        if (result === null) return HttpErrorHandler(res, new Error("Delete failed"), 401);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}