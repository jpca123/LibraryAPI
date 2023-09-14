import { NextFunction, Request, Response } from "express";
import HttpErrorHandler from "../utilities/httpErrorHandler";
import SecurityRepository from "../repositories/securityRepository";
import UserRepository from "../repositories/userRepository";
import ReqUserExt from "../interfaces/IReqUserExt";
import Session from "../models/Session";

const securityRepository: SecurityRepository = new SecurityRepository();
const userRepository: UserRepository = new UserRepository();


export async function validateSesion(req: ReqUserExt, res: Response, next: NextFunction) {
    // extrayendo informacion
    let reqToken: string = req.get("Authorization") || "";
    let token: string = reqToken.replace("Bearer ", "") || "";
    if (reqToken === "" || token === "") return HttpErrorHandler(res, new Error("Unauthorized, token not included"), 401);
    
    
    let session = await Session.findOne({token});

    if(!session) return HttpErrorHandler(res, new Error("Unauthorized, token not is valid"), 401);
    let datos: any = await securityRepository.validToken(token);
    if (!datos) {
        if (session) Session.deleteOne({userid: session.userId});
        return HttpErrorHandler(res, new Error("Unauthorized, token not is valid"), 401);
    }

    let data: string = datos.userId as string;
    let userObject = await userRepository.getById(data);

    // validadndo informacion
    if(!userObject.ok) return HttpErrorHandler(res, new Error("Unauthorized, user not found"), 401);
    let user: any = userObject.data;

    console.log({userObject})

    // manejo de usuario
    user.set("password", undefined, {strict: false});
    user.set("createdAt", undefined, {strict: false});
    user.set("updatedAt", undefined, {strict: false});
    req.user = user;
    next();
}