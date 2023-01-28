import { Request, Response } from "express";
import Category from "../interfaces/Category";
import CategoryService from "../services/categoryService";
import HttpErrorHandler from "../utilities/httpErrorHandler";

const categoryService: CategoryService = new CategoryService();


export async function getAllCategories(req: Request, res: Response) {
    try {
        let page = null;
        if(req.query.page) page = parseInt(req.query.page as string);
        else page = 1;

        let limit = null;
        if(req.query.limit) limit = parseInt(req.query.limit as string);
        else limit = 20;

        let result = await categoryService.getAll(page, limit);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function getCategory(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await categoryService.getById(id);
        if(result === null) return res.send("Category not found");
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function createCategory(req: Request, res: Response) {
    try {
        let category = req.body;
        let categoryCreated = await categoryService.create(category);

        if (categoryCreated === null) return HttpErrorHandler(res, new Error("Creation falied"), 403);
        res.json(categoryCreated);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function updateCategory(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let category = req.body;
        let categoryUpdated = await categoryService.update(id, category);

        if (categoryUpdated === null) return HttpErrorHandler(res, new Error("Updated failed"), 403);
        res.json(categoryUpdated);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
export async function deleteCategory(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await categoryService.delete(id);

        if (result === null) return HttpErrorHandler(res, new Error("Delete failed"), 403);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
