import { NextFunction, Request, Response } from "express";
import HttpErrorHandler from "../utilities/httpErrorHandler";
import SecurityService from "../services/securityService";

const securityService: SecurityService = new SecurityService();

export async function validateSesionId(req: Request, res: Response, next: NextFunction){
    if(req.get("token") === undefined) return HttpErrorHandler(res, new Error("Unauthorized, token not included"), 401);

    let token: string = req.get("token") || "";
    console.log(req.get("token"), token);
    let datos = securityService.validToken(token);

    if(!datos) return HttpErrorHandler(res, new Error("Unauthorized, token not is valid"), 401);

    next();
}

export async function validateSesion(req: Request, res: Response, next: NextFunction) {

        if (req.get("token") === undefined) return HttpErrorHandler(res, new Error("Unauthorized, token not included"), 401);

        let token: string = req.get("token") || "";
        console.log(req.get("token"), token);
        let datos = securityService.validToken(token);

        if (!datos) return HttpErrorHandler(res, new Error("Unauthorized, token not is valid"), 401);

        next();
    }