import User from "../models/User";
import IUser from "../interfaces/IUser";
import SecurityRepository from "./securityRepository";
import UserRepository from "./userRepository";
import Session from "../models/Session";
import ChangePassword from "../models/ChangePassword";
import { env } from "process";
import IMailOptions from "../interfaces/IMailOptions"
import sendMail from "../utilities/handleMail";

export default class AuthRepository {

    private securityRepository: SecurityRepository;
    private userRepository: UserRepository;

    constructor() {
        this.securityRepository = new SecurityRepository();
        this.userRepository = new UserRepository();
    }

    async login(username: string, password: string) {
        if (!username || !password) return null;
        let user = await User.findOne({ userName: username });
        if (user === null) return null;

        let userPasswordDecrypted = this.securityRepository.decrypt(user.password);

        if (password === userPasswordDecrypted) {
            let tokenEncrypted = this.securityRepository.generateToken({ userName: user.userName });
            await Session.findOneAndRemove({ userName: user.userName });

            let createSession = await Session.create({ userName: user.userName, token: tokenEncrypted });
            if (createSession) {
                let infoMail: IMailOptions = {
                    from: env.EMAILUSER!,
                    to: user.email,
                    subject: "Sesion started",
                    text: `${user.userName}, you are started a session in your account, if are not you plis change your password now`,
                    html: `<p>${user.userName}, you are started a session in your account, if are not you plis change your password now`
                };

                await sendMail(infoMail);
                return { token: tokenEncrypted };
            } 

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
        let usernameValidation = await this.userRepository.getByUserName(user.userName);
        if (usernameValidation !== null) return {
            error: new Error("The username already exist")
        };

        user.password = this.securityRepository.encrypt(user.password);
        let userCreated = await User.create(user);
        if (userCreated) return userCreated;
        return null;
    }

    async validSession(token: string) {
        let session = await Session.findOne({ token });
        if (session) {
            let data = await this.securityRepository.validToken(token);
            if (data) return true;
        };
        return false;
    }

    async forgotPassword(email: string) {
        let requestUser = await this.userRepository.getByEmail(email);
        if (!requestUser) return null;

        let user = requestUser.data;

        let userName = user.userName;
        let token = this.securityRepository.generateToken({ userName });

        try {
            await ChangePassword.findOneAndRemove({ userName });
            let dbInfo = await ChangePassword.create({ userName, token });
            if (!dbInfo) throw new Error("Token not find in db");
        } catch (err: any) {
            // delete a lastest try for security
            await ChangePassword.findOneAndRemove({ userName });
            return false;
        }

        let infoMail: IMailOptions = {
            from: env.EMAILUSER!,
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

        let validToken = await this.securityRepository.validToken(token);
        if (!validToken) {
            await sessionDB.remove();
            return false;
        };


        let requestUser = await this.userRepository.getByUserName(sessionDB.userName);
        if (!requestUser) return false;

        let user = requestUser.data;
        user.password = this.securityRepository.encrypt(newPassword);

        await user.save();
        await sessionDB.remove();
        return true;
    }
}