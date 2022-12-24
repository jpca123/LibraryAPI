import { Response } from "express";

export default function HttpErrorHandler(res: Response, err:any, status?: number){
    res.status(status || 502);
    res.json({
        ok: false,
        error: err.type || "Error",
        message: err.message || "Unknown error"
    });
}