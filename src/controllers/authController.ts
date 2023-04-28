import { Request, Response } from "express";
import ReqUserExt from "../interfaces/IReqUserExt";
import AuthRepository from "../repositories/authRepository";
import SecurityRepository from "../repositories/securityRepository";
import UserRepository from "../repositories/userRepository";
import HttpErrorHandler from "../utilities/httpErrorHandler";
import { env } from "process";
import User from "../interfaces/IUser";
import MailOptions from "../interfaces/IMailOptions";
import sendMail from "../utilities/handleMail";

const userRepository: UserRepository = new UserRepository();
const authRepository: AuthRepository = new AuthRepository();

export async function login(req: Request, res: Response) {
    try {
        let { userName, password } = req.body;
        let logueo = await authRepository.login(userName, password);
        res.json(logueo);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }

}

export async function register(req: Request, res: Response) {
    try {
        let user = req.body as User;
        let userCreated: User = await authRepository.register(user) as User;

        if (userCreated === null) return HttpErrorHandler(res, new Error("Creation failed"), 401);
        res.json(userCreated);

        let mailOptions: MailOptions = {
            from: env.EMAIL_USER as string,
            to: userCreated.email,
            subject: "Create Account",
            text: `Welcome ${userCreated.userName}, you are your account for manage yours favorites books`,
            html: `Welcome <b>${userCreated.userName}</b>, you are your account for manage yours favorites books`
        }

        await sendMail(mailOptions);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function logout(req: ReqUserExt, res: Response) {
    try {
        console.log(req.user)
        let userName: string = req.user?.userName || "";
        if (userName === "") return res.status(403).json({ error: "Error Session", message: "Session not found" });

        let logout = await authRepository.logout(userName);
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
        if(validSesion) return res.json({valid: true});
        return res.json(validSesion);
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function forgotPassword(req: Request, res: Response) {
    try {
        let {email} = req.body;
        await authRepository.forgotPassword(email);
        return res.send({ok: true, message: "Mail send"});
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}

export async function changePassword(req: Request, res: Response) {
    try {
        let {password} = req.body;
        let token: string = req.headers.token as string;
        let passwordChanged = await authRepository.changePassword(token, password);
        if(!passwordChanged) return HttpErrorHandler(res, new Error("Can not change the password, token expired"), 401);

        return res.send({ok: true, message: "Password has been changed"});
        
    } catch (err: any) {
        return HttpErrorHandler(res, err);
    }
}
