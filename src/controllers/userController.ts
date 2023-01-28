import { Request, Response } from "express";
import ReqUserExt from "../interfaces/ReqUserExt";
import SecurityService from "../services/securityService";
import UserService from "../services/userService";
import HttpErrorHandler from "../utilities/httpErrorHandler";

const securityService: SecurityService = new SecurityService()
const userService: UserService = new UserService();

export async function login(req: Request, res: Response) {
    try {
        let { userName, password } = req.body;
        let logueo = await userService.login(userName, password);
        res.json(logueo);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }

}

export async function getAllUsers(req: ReqUserExt, res: Response) {
    try {
        let page = null;
        if(req.query.page) page = parseInt(req.query.page as string);
        else page = 1;

        let limit = null;
        if(req.query.limit) limit = parseInt(req.query.limit as string);
        else limit = 20;
        let result = await userService.getAll(page, limit);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function getUser(req: Request, res: Response) {
    try {
        let id: string = req.body.id;
        let user = await userService.getById(id);
        if (user === null) return HttpErrorHandler(res, new Error("User not found"), 401);
        return res.json(user);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function getBooks(req: ReqUserExt, res: Response) {
    try {
        let id: string;
        if(!req.user) return HttpErrorHandler(res, new Error("User not found"), 403); 
        else id = req.user._id;

        let books = await userService.getBooks(id);
        return res.json(books);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function setBook(req: ReqUserExt, res: Response) {
    try {
        let idUser: string;
        if(!req.user) return HttpErrorHandler(res, new Error("User not found"), 403); 
        else idUser = req.user._id;
        
        let {bookId} = req.body;
        console.log(req.body)
        let bookVerify = await userService.setBook(idUser, bookId);
        if (bookVerify === null) return HttpErrorHandler(res, new Error("Can not add the book"), 403);
        res.json(bookVerify);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function createUser(req: Request, res: Response) {
    try {
        let user = req.body;
        let userCreated = await userService.create(user);

        if (userCreated === null) return HttpErrorHandler(res, new Error("Creation failed"), 401);
        res.json(userCreated);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let user = req.body;
        let userUpdated = await userService.update(id, user);

        if (userUpdated === null) return HttpErrorHandler(res, new Error("Updated failed"), 401);
        res.json(userUpdated);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await userService.delete(id);

        if (result === null) return HttpErrorHandler(res, new Error("Delete failed"), 401);
        res.json(result);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function deleteUserBook(req: ReqUserExt, res: Response) {
    try {
        let idUser: string;
        if(!req.user) return HttpErrorHandler(res, new Error("User not found"), 403); 
        else idUser = req.user._id;
        
        let { bookId } = req.params;
        let result = await userService.deleteUserBook(idUser, bookId);

        if (result === null) return HttpErrorHandler(res, new Error("Delete of book failed"), 401);
        res.json({o: true});
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
