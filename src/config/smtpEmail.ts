import nodemailer,  { Transporter } from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import { env } from "process";

export const transporter = nodemailer.createTransport({
    service: env.EMAIL_SERVICE,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD
    },
});

export async function verifySMTPConnection(cb?: (err: Error | null, conn: Boolean | null) => void){
    try {
        let connection = await transporter.verify();
        if(cb) cb(null, connection);
    } catch (err: any) {
        if(cb) cb(null, err);
    }
}

export async function sendMail(options: MailOptions, cb?: Function){
    try {
        let result = await transporter.sendMail(options);
        if(cb) return cb(null, result)
    } catch (err) {
        if(cb) return cb(err);
    }    
}