import jwt from "jsonwebtoken";
import cryptoJS from "crypto-js";
import { env } from "process";


export default class SecurityService {

    encrypt(text: string) {
        let encripted = cryptoJS.AES.encrypt(text, env.CryptoJSAESKey || "").toString();
        return encripted;
    }

    decrypt(encrypt: string) {
        let bytes = cryptoJS.AES.decrypt(encrypt, env.CryptoJSAESKey || "");
        let info = bytes.toString(cryptoJS.enc.Utf8);
        return info;
    }

    generateToken(data: any) {
        let token = jwt.sign(data, env.JWTKey || "", { expiresIn: "5h" });
        let encryptedToken = this.encrypt(token);
        return encryptedToken;
    }

    async validToken(token: string) {
        if (!token) return false;
        let decryptedToken = this.decrypt(token);
        try {
            let payload = jwt.verify(decryptedToken, env.JWTKey || "");
            if (!payload) return false;
            return payload;
        } catch (err: any) {
            return false;
        }
    }
}
