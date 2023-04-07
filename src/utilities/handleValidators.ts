import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const validateResult = (req: Request, res: Response, next: NextFunction) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let list = errors.array().map(el => `${el.param} -- ${el.location} -- ${el.value} -- ${el.msg || "N/A"}`);
        console.log(list);
        return res.status(400).json({ errors: errors.array(), message: "Request Fail" });
    }
    return next();
}

export default validateResult;