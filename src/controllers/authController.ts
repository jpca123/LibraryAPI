import { Request, Response } from "express";
import ReqUserExt from "../interfaces/ReqUserExt";
import AuthService from "../services/authService";
import SecurityService from "../services/securityService";
import UserService from "../services/userService";
import HttpErrorHandler from "../utilities/httpErrorHandler";

const userService: UserService = new UserService();
const authService: AuthService = new AuthService();

export async function login(req: Request, res: Response) {
    try {
        let { userName, password } = req.body;
        let logueo = await authService.login(userName, password);
        res.json(logueo);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }

}

export async function register(req: Request, res: Response) {
    try {
        let user = req.body;
        let userCreated = await authService.register(user);

        if (userCreated === null) return HttpErrorHandler(res, new Error("Creation failed"), 401);
        res.json(userCreated);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function logout(req: ReqUserExt, res: Response) {
    try {
        console.log(req.user)
        let userName: string = req.user?.userName || "";
        if (userName === "") return res.status(403).json({ error: "Error Session", message: "Session not found" });

        let logout = await authService.logout(userName);
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

        let validSesion = await authService.validSession(token);
        if(validSesion) return res.json({valid: true});
        return res.json({valid: false});
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function forgotPassword(req: Request, res: Response) {
    try {
        let {email} = req.body;
        await authService.forgotPassword(email);
        return res.send({ok: true, message: "Mail send"});
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function changePassword(req: Request, res: Response) {
    try {
        let {password} = req.body;
        let token: string = req.headers.token as string;
        let passwordChanged = await authService.changePassword(token, password);
        if(!passwordChanged) return HttpErrorHandler(res, new Error("Can not change the password, token expired"), 401);

        return res.send({ok: true, message: "Password has been changed"});
        
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
