import jwt from "jsonwebtoken";
import cryptoJS from "crypto-js";
import { env } from "process";


export default class SecurityService {



    validateRouteIsIgnored(ignore: string[][], path: string, method: string): boolean{
        /* 
        valid if the path is included in the list or routes ignores, if exist into of this list return true else return false
        params: 
            ignore: string[][] --> the list of ignores routes
                ej: [ ["/path1", "GET"], ["/path2/:parameter", "POST"] ] the simbol ":" is required for evaluate url params
            path: string --> the path of the request
            method: string --> the http method of the request
        */

        if(!ignore || ignore.length === 0) return false;

        for (let ignoreRoute of ignore) {
            let [pathIgnore, methodIgnore] = ignoreRoute;

            let validationMethodIgnore: boolean = method.toUpperCase() === methodIgnore.toUpperCase();
            
            if(!validationMethodIgnore) continue;

            // allow acces to any url with the method http of ignore
            if(pathIgnore === "/**") {
                return true;
            }
            
            let validationPathIgnore: boolean = path === pathIgnore;
            if (validationPathIgnore) return true;

            // si tienen parametros
            let pathsIgnore = pathIgnore.split("/");
            let pathsRequest = path.split("/");

            if (pathsIgnore.length !== pathsRequest.length) continue;

            let newValidation: boolean = true;
            for (let i = 0; i < pathsIgnore.length; i++) {
                if (pathsIgnore[i][0] === ':') continue;

                if (pathsIgnore[i] !== pathsRequest[i]) {
                    newValidation = false;
                    break;
                }
            }

            if(newValidation) return true;
        }
        return false;
    }

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
        let token = jwt.sign(data, env.JWTKey || "", { expiresIn: "2d" });
        let encryptedToken = this.encrypt(token);
        return encryptedToken;
    }

    validToken(token: string) {
        if (!token) return false;
        let decryptedToken = this.decrypt(token);
        try {
            let payload = jwt.verify(decryptedToken, env.JWTKey || "");
            console.log(payload);
            if (!payload) return false;
            return payload;
        } catch (err: any) {
            return false;
        }
    }
}
