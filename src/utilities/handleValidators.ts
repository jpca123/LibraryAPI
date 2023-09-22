import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const validateResult = (req: Request, res: Response, next: NextFunction) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array().map((err: any)=> {
                return {error: err.param, message: `${err.param}: ${err.msg || "Unknow Error"}` };
            })
        });
    }
    return next();
}

export default validateResult;