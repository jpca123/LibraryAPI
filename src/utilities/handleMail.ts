import nodemailer,  { Transporter } from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import { env } from "process";

const transporter = nodemailer.createTransport({
    service: env.EMAILSERVICE,
    auth: {
        user: env.EMAILUSER,
        pass: env.EMAILPASSWORD
    },
});

transporter.verify()
.then(res =>console.log("SMTP gmail funcionando") )
.catch(err => console.log("SMTP gmail no funciona", err))

export async function sendMail(options: MailOptions, cb?: Function){
    try {
        let result = await transporter.sendMail(options);
        if(cb) return cb(null, result)
    } catch (err) {
        if(cb) return cb(err);
    }    
}