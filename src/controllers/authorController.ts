import { Request, Response } from "express";
import Author from "../interfaces/Author";
import AuthorRepository from "../repositories/authorRepository";
import HttpErrorHandler from "../utilities/httpErrorHandler";

const authorRepository: AuthorRepository = new AuthorRepository();


export async function getAllAuthors(req: Request, res: Response) {
    try {
        let page = null;
        if(req.query.page) page = parseInt(req.query.page as string);
        else page = 1;

        let limit = null;
        if(req.query.limit) limit = parseInt(req.query.limit as string);
        else limit = 20;
        let result = await authorRepository.getAll(page, limit);
        res.json({data: result});
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function getAuthor(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await authorRepository.getById(id);
        if(result === null) HttpErrorHandler(res, new Error("Author not found"), 404);
        res.json({data: result});
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function createAuthor(req: Request, res: Response) {
    try {
        let author = req.body;
        let authorCreated = await authorRepository.create(author);

        if (authorCreated === null) return HttpErrorHandler(res, new Error("Creation falied"), 401);
        res.json({data: authorCreated});
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function updateAuthor(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let author = req.body;
        let authorUpdated = await authorRepository.update(id, author);

        if (authorUpdated === null) return HttpErrorHandler(res, new Error("Updated failed"), 401);
        res.json({data: authorUpdated});
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function deleteAuthor(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await authorRepository.delete(id);

        if (result === null) return HttpErrorHandler(res, new Error("Delete failed"), 401);
        res.json({ok: true});
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
