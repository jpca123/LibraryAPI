import { Request, Response } from "express";
import ReqUserExt from "../interfaces/IReqUserExt";
import AuthRepository from "../repositories/authRepository";
import SecurityRepository from "../repositories/securityRepository";
import HttpErrorHandler from "../utilities/httpErrorHandler";
import IUser from "../interfaces/IUser";

const authRepository: AuthRepository = new AuthRepository();
const securityRepository: SecurityRepository = new SecurityRepository();

export async function login(req: Request, res: Response) {
    try {
        let { userName, password } = req.body;
        let logueo = await authRepository.login(userName, password) as any;
        if(!logueo.ok) res.status(401);
        res.json(logueo);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }

}

export async function register(req: Request, res: Response) {
    try {
        let user = req.body as IUser;
        let userCreated = await authRepository.register(user);

        if (!userCreated.ok) res.status(403);
        res.json(userCreated);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function logout(req: ReqUserExt, res: Response) {
    try {
        let token: string = req.body.token;
        let userNameRequest: any = await securityRepository.validToken(token);
        let userName = userNameRequest.userName as string;

        let logout = await authRepository.logout(userName);
        if(!logout.ok) res.status(403);
        res.json(logout);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function validSession(req: Request, res: Response) {
    try {
        // extrayendo informacion
        let token: string = req.body.token || "";
        if (token === "") return HttpErrorHandler(res, new Error("Unauthorized, token included"), 401);

        let validSesion = await authRepository.validSession(token);
        if(!validSesion.ok) res.status(401);
        return res.json(validSesion);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function forgotPassword(req: Request, res: Response) {
    try {
        let {email} = req.body;
        await authRepository.forgotPassword(email);
        return res.send({ok: true, data: {message: "Mail send"}});
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function changePassword(req: Request, res: Response) {
    try {
        let {password} = req.body;
        let token: string = req.headers.token as string;
        let passwordChanged = await authRepository.changePassword(token, password);
        if(passwordChanged.ok) return res.send({ok: true, message: "Password has been changed"});
        res.status(401).send(passwordChanged);

    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
