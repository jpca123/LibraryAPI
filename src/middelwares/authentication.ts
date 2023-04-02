import { NextFunction, Request, Response } from "express";
import HttpErrorHandler from "../utilities/httpErrorHandler";
import SecurityService from "../services/securityService";
import UserService from "../services/userService";
import ReqUserExt from "../interfaces/ReqUserExt";
import Session from "../models/Session";

const securityService: SecurityService = new SecurityService();
const userService: UserService = new UserService();


export async function validateSesion(req: ReqUserExt, res: Response, next: NextFunction) {
    // extrayendo informacion
    let reqToken: string = req.get("Authorization") || "";
    let token: string = reqToken.replace("Bearer ", "") || "";
    if (reqToken === "" || token === "") return HttpErrorHandler(res, new Error("Unauthorized, token not included"), 401);
    
    
    let session = await Session.findOne({token});

    if(!session) return HttpErrorHandler(res, new Error("Unauthorized, token not is valid"), 401);
    let datos = await securityService.validToken(token);
    if (!datos) {
        if (session) session.remove();
        return HttpErrorHandler(res, new Error("Unauthorized, token not is valid"), 401);
    }

    let data: string = JSON.parse(JSON.stringify(datos)).userName;

    let user = await userService.getByUserName(data);

    // validadndo informacion
    if(!user) return HttpErrorHandler(res, new Error("Unauthorized, user not found"), 401);

    // manejo de usuario
    user.set("password", undefined, {strict: false});
    user.set("createdAt", undefined, {strict: false});
    user.set("updatedAt", undefined, {strict: false});
    req.user = user;
    console.log("Req from user: ", req.user.userName);
    next();
}