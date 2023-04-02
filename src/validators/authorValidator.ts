import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import { validationResult } from "express-validator/src/validation-result";
import ReqUserExt from "../interfaces/ReqUserExt";
import HttpErrorHandler from "../utilities/httpErrorHandler";

export const validateAuthor = [

    check(["name", "country"])
        .exists()
        .isEmpty()
        .isLength({ min: 5, max: 30 }),

    check("lastName")
        .isLength({ max: 30 }),

    check("description")
        .isLength({ max: 300 }),

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