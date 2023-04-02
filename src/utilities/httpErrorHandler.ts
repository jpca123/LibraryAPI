import { Response } from "express";

export default function HttpErrorHandler(res: Response, err:any, status?: number){
    res.status(status || 502);
    console.log(err)
    res.json({
        ok: false,
        errors: [{error: err.type || "Error", message: err.message || err._message || "Unknown error",}],
    });
}