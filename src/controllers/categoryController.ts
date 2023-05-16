import { Request, Response } from "express";
import Category from "../interfaces/ICategory";
import CategoryRepository from "../repositories/categoryRepository";
import HttpErrorHandler from "../utilities/httpErrorHandler";

const categoryRepository: CategoryRepository = new CategoryRepository();


export async function getAllCategories(req: Request, res: Response) {
    try {
        let page = null;
        if(req.query.page) page = parseInt(req.query.page as string);
        else page = 1;

        let limit = null;
        if(req.query.limit) limit = parseInt(req.query.limit as string);
        else limit = 20;

        let result = await categoryRepository.getAll(page, limit);
        if(!result.ok) res.status(403);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function getCategory(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await categoryRepository.getById(id);
        if(!result.ok) res.status(403);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function createCategory(req: Request, res: Response) {
    try {
        let category = req.body;
        let categoryCreated = await categoryRepository.create(category);

        if (!categoryCreated.ok) res.status(403);
        res.json(categoryCreated);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function updateCategory(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let category = req.body;
        let categoryUpdated = await categoryRepository.update(id, category);

        if (!categoryUpdated.ok) res.json(403);
        res.json(categoryUpdated);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function deleteCategory(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await categoryRepository.delete(id);

        if (!result.ok) res.json(403);
        return res.json();
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
