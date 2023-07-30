import User from "../models/User";
import IUser from "../interfaces/IUser";
import SecurityRepository from "./securityRepository";
import UserRepository from "./userRepository";
import Session from "../models/Session";
import ChangePassword from "../models/ChangePassword";
import { env } from "process";
import IMailOptions from "../interfaces/IMailOptions"
import { MailOptions } from "nodemailer/lib/json-transport";
import { sendMail } from "../config/smtpEmail";

export default class AuthRepository {

    private securityRepository: SecurityRepository;
    private userRepository: UserRepository;

    constructor() {
        this.securityRepository = new SecurityRepository();
        this.userRepository = new UserRepository();
    }

    async login(username: string, password: string) {
        if (!username || !password) return { ok: false, errors: [{error: "Invalid Credentials", message: "Username or password are incorrect"}] };
        let user = await User.findOne({ userName: username });
        if (user === null) return { ok: false, errors: [{error: "Not Found", message: "User not found"}] };

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

                await sendMail(infoMail, console.log);
                return { ok: true, token: tokenEncrypted };
            }

            return { ok: false, errors: [{error: "Invalid Credentials", message: "User or password are incorrect"}] };

        }
        return { ok: false, errors: [{error: "Invalid Credentials", message: "User or password are incorrect"}] };

    }

    async logout(userName: string) {
        let session = await Session.findOne({ userName });
        if(session) await session.remove();
        return { ok: true, data: { message: "Session closed correctly" } };
    }

    async register(user: IUser) {
        let usernameValidation = await this.userRepository.getByUserName(user.userName);
        if (usernameValidation.ok) return { ok: false, errors: [{error: "Validation Error", message: "The username already exists"}] };

        user.password = this.securityRepository.encrypt(user.password);
        let userCreated = await User.create(user);
        
        if (userCreated) {
            let userData: IUser = userCreated;
            let mailOptions: MailOptions = {
                from: env.EMAIL_USER as string,
                to: userData.email,
                subject: "Create Account",
                text: `Welcome ${userData.userName}, you are your account for manage yours favorites books`,
                html: `Welcome <b>${userData.userName}</b>, you are your account for manage yours favorites books`
            }
            await sendMail(mailOptions);
            return { ok: true, data: userCreated };
        } 
        return { ok: false, errors: [{error: "Create Error", message: "Creation failed"}] };
    }

    async validSession(token: string) {
        let session = await Session.findOne({ token });
        if (session) {
            let data = await this.securityRepository.validToken(token);
            if (data) return { ok: true };
        };
        return { ok: false, errors: [{error: "Invalid Session", message: "Invalid Session"}] };
    }

    async forgotPassword(email: string) {
        let requestUser = await this.userRepository.getByEmail(email);
        if (!requestUser.ok) return { ok: false };

        let user = requestUser.data!;

        let userName = user.userName;
        let token = this.securityRepository.generateToken({ userName });

        try {
            await ChangePassword.findOneAndRemove({ userName });
            let dbInfo = await ChangePassword.create({ userName, token });
            if (!dbInfo) throw {error: "Not Found", message: "Token not valid"};
        } catch (err: any) {
            // delete a lastest try for security
            await ChangePassword.findOneAndRemove({ userName });
            return { ok: false };
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
            console.log("mail send correctly")
        });
        return { ok: true, data: mailSended };
    }

    async changePassword(token: string, newPassword: string) {
        token = decodeURIComponent(token);
        console.log(token, newPassword)
        let sessionDB = await ChangePassword.findOne({ token });
        if (!sessionDB) return { ok: false, errors: [{error: "Invalid Session", message: "Invalid Session"}] };

        let validToken = await this.securityRepository.validToken(token);
        if (!validToken) {
            await sessionDB.remove();
            return { ok: false, errors: [{error: "Invalid Session", message: "Invalid Session"}] };
        };


        let requestUser = await this.userRepository.getByUserName(sessionDB.userName);
        if (!requestUser) return { ok: false, errors: [{error: "Not Found", message: "User not found"}] };

        let user = requestUser.data!;
        user.password = this.securityRepository.encrypt(newPassword);

        await user.save();
        await sessionDB.remove();
        return { ok: true };
    }
}