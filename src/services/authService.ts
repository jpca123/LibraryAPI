import User from "../models/User";
import IUser from "../interfaces/user";
import SecurityService from "./securityService";
import UserService from "./userService";
import Session from "../models/Session";
import ChangePassword from "../models/ChangePassword";
import { env } from "process";
import { MailOptions } from "nodemailer/lib/json-transport";
import { sendMail } from "../utilities/handleMail";

export default class AuthService {

    private securityService: SecurityService;
    private userService: UserService;

    constructor() {
        this.securityService = new SecurityService();
        this.userService = new UserService();
    }

    async login(username: string, password: string) {
        if (!username || !password) return null;
        let user = await User.findOne({ userName: username });
        if (user === null) return null;

        let userPasswordDecrypted = this.securityService.decrypt(user.password);

        if (password === userPasswordDecrypted) {
            let tokenEncrypted = this.securityService.generateToken({ userName: user.userName });
            await Session.findOneAndRemove({ userName: user.userName });

            let createSession = await Session.create({ userName: user.userName, token: tokenEncrypted });
            if (createSession) return { token: tokenEncrypted };

            return {
                error: new Error("Create Session failed")
            }

        }
        return null;
    }

    async logout(userName: string) {
        let session = await Session.findOne({ userName });
        if (!session) return { error: new Error("Not exist a session active") };

        let closeSession = await session.remove();
        if (!closeSession) return { error: new Error("Not exist a session active") };
        return { ok: true, message: "Session closed correctly" };
    }

    async register(user: IUser) {
        // TODO: agregar validaciones y quitar estas de aqui
        let usernameValidation = await this.userService.getByUserName(user.userName);
        if (usernameValidation !== null) return {
            error: new Error("The username already exist")
        };

        user.password = this.securityService.encrypt(user.password);
        let userCreated = await User.create(user);
        if (userCreated) return userCreated;
        return null;
    }

    async validSession(token: string) {
        let session = await Session.findOne({ token });
        if (session) {
            let data = await this.securityService.validToken(token);
            if (data) return true;
        };
        return false;
    }

    async forgotPassword(email: string) {
        let user = await this.userService.getByEmail(email);
        if (!user) return null;

        let userName = user.userName;
        let token = this.securityService.generateToken({ userName });

        try {
            await ChangePassword.findOneAndRemove({ userName });
            let dbInfo = await ChangePassword.create({ userName, token });
            if (!dbInfo) throw new Error("Token not find in db");
        } catch (err: any) {
            // delete a lastest try for security
            await ChangePassword.findOneAndRemove({ userName });
            return false;
        }

        let infoMail: MailOptions = {
            from: env.EMAILUSER,
            to: user.email,
            subject: "Change Password",
            text: `${userName}, for change the password of your account click here`,
            html: `<p><mark>${userName}</mark>, for change the password of your account <b><a style="a{color: blue;}" href="http://localhost:3000/auth/reset_password/${encodeURIComponent(token)}" target="_blank">click here</a></b></p>`
        };

        let mailSended = await sendMail(infoMail, async (err: any, result: any) => {
            if (err) return console.log("Error al enviar correo", err.message)
        });
        return mailSended;
    }

    async changePassword(token: string, newPassword: string) {
        token = decodeURIComponent(token);
        console.log(token, newPassword)
        let sessionDB = await ChangePassword.findOne({ token });
        if (!sessionDB) return false;

        let validToken = await this.securityService.validToken(token);
        if (!validToken) {
            await sessionDB.remove();
            return false
        };


        let user = await this.userService.getByUserName(sessionDB.userName);
        if (!user) return false;

        user.password = this.securityService.encrypt(newPassword);

        await user.save();
        await sessionDB.remove();
        return true;
    }
}