import { NextFunction, Request, Response } from "express";
import { body, check, validationResult } from "express-validator";
import ReqUserExt from "../interfaces/ReqUserExt";
import HttpErrorHandler from "../utilities/httpErrorHandler";

const validateResult = (req: Request, res: Response, next: NextFunction) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return next();
}

export const validateBook = [
    check("title", "")
        .exists()
        .withMessage("The title is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("The title should has minim 3 characters and 50 maximum 50 charcters"),

    check(["categoryId", "authorId"])
        .exists()
        .withMessage("This field is required"),


    check("description")
        .isLength({ max: 200 })
        .withMessage("The descripcion should has a 200 characters maxim"),

    check("pages")
        .exists()
        .withMessage("Pages is required")
        .isNumeric()
        .withMessage("Pages should be a number"),

    (req: Request, res: Response, next: NextFunction) => validateResult(req, res, next)
]