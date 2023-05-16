import { Request, Response } from "express";
import Author from "../interfaces/IAuthor";
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
        if(!result.ok) res.status(403);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function getAuthor(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await authorRepository.getById(id);
        if(!result.ok) res.status(403);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function createAuthor(req: Request, res: Response) {
    try {
        let author = req.body;
        let authorCreated = await authorRepository.create(author);
        if(!authorCreated.ok) res.status(403);
        res.json(authorCreated);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function updateAuthor(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let author = req.body;
        let authorUpdated = await authorRepository.update(id, author);

        if (!authorUpdated.ok) res.status(403);
        res.json(authorUpdated);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function deleteAuthor(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await authorRepository.delete(id);
        if(!result.ok) res.status(403);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
