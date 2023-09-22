import { NextFunction, Request, Response } from "express";
import HttpErrorHandler from "../utilities/httpErrorHandler";
import SecurityRepository from "../repositories/securityRepository";
import UserRepository from "../repositories/userRepository";
import ReqUserExt from "../interfaces/IReqUserExt";
import Session from "../models/Session";
import ISession from "../interfaces/ISession";
import IUser from "../interfaces/IUser";
import { Document } from "mongoose";

const securityRepository: SecurityRepository = new SecurityRepository();
const userRepository: UserRepository = new UserRepository();


export async function validateSesion(req: ReqUserExt, res: Response, next: NextFunction) {
    // extrayendo informacion
    let reqToken: string = req.get("Authorization") || "";
    let token: string = reqToken.replace("Bearer ", "") || "";
    if (reqToken === "" || token === "") return HttpErrorHandler(res, new Error("Unauthorized, token not included"), 401);
    
    
    let session = await Session.findOne({token});
    if(!session) return HttpErrorHandler(res, new Error("Unauthorized, token not is valid"), 401);

    let datos: ISession = await securityRepository.validToken(token) as ISession;
    if (!datos) {
        if (session) Session.deleteOne({userId: session.userId});
        return HttpErrorHandler(res, new Error("Unauthorized, token not is valid"), 401);
    }

    let data = datos.userId;
    let userObject = await userRepository.getById(data);

    // validadndo informacion
    if(!userObject.ok) return HttpErrorHandler(res, new Error("Unauthorized, user not found"), 401);
    let user = userObject.data!;

    // manejo de usuario
    user.set("password", undefined, {strict: false});
    user.set("createdAt", undefined, {strict: false});
    user.set("updatedAt", undefined, {strict: false});
    req.user = user;

    console.log("req from user:", user.userName)
    next();
}