import { Request, Response } from "express";
import ReqUserExt from "../interfaces/ReqUserExt";
import SecurityRepository from "../repositories/securityRepository";
import UserRepository from "../repositories/userRepository";
import HttpErrorHandler from "../utilities/httpErrorHandler";

const securityRepository: SecurityRepository = new SecurityRepository()
const userRepository: UserRepository = new UserRepository();


export async function getAllUsers(req: ReqUserExt, res: Response) {
    try {
        let page = null;
        if(req.query.page) page = parseInt(req.query.page as string);
        else page = 1;

        let limit = null;
        if(req.query.limit) limit = parseInt(req.query.limit as string);
        else limit = 20;
        let result = await userRepository.getAll(page, limit);
        res.json({data: result});
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function getUser(req: Request, res: Response) {
    try {
        let id: string = req.body.id;
        let user = await userRepository.getById(id);
        if (user === null) return HttpErrorHandler(res, new Error("User not found"), 401);
        return res.json({data: user});
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function getBooks(req: ReqUserExt, res: Response) {
    try {
        let id: string;
        if(!req.user) return HttpErrorHandler(res, new Error("User not found"), 403); 
        else id = req.user._id;

        let books = await userRepository.getBooks(id);
        return res.json({data: books});
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
        let bookVerify = await userRepository.setBook(idUser, bookId);
        if (bookVerify === null) return HttpErrorHandler(res, new Error("Can not add the book"), 403);
        res.json({data: bookVerify});
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}


export async function updateUser(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let user = req.body;
        let userUpdated = await userRepository.update(id, user);

        if (userUpdated === null) return HttpErrorHandler(res, new Error("Updated failed"), 401);
        res.json({data: userUpdated});
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        let id: string = req.params.id;
        let result = await userRepository.delete(id);

        if (result === null) return HttpErrorHandler(res, new Error("Delete failed"), 401);
        res.json({ok: true});
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
        let result = await userRepository.deleteUserBook(idUser, bookId);

        if (result === null) return HttpErrorHandler(res, new Error("Delete of book failed"), 401);
        res.json({ok: true});
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
