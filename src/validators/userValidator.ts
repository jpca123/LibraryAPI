import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import { validationResult } from "express-validator/src/validation-result";
import ReqUserExt from "../interfaces/ReqUserExt";
import HttpErrorHandler from "../utilities/httpErrorHandler";

export const validateUser = [
    check(["name", "userName"])
        .exists()
        .not()
        .isEmpty()
        .isLength({ min: 5, max: 50 }),

    check("gender")
        .exists()
        .isEmpty()
        .isIn(["Masculine", "Femenine", "Prefer not say"]),

    check("password")
        .exists()
        .isEmpty()
        .isLength({ min: 6, max: 15 }),

    check("email")
        .exists()
        .isEmpty()
        .isEmail(),

    check("lastName")
        .isLength({ max: 50 }),


    (req: Request, res: Response, next: NextFunction) => {
        try {
            validationResult(req).throw();
            return next()
        }
        catch (err: any) {
            return HttpErrorHandler(res, err, 403);
        }
    }
]