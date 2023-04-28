import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../utilities/handleValidators";


export const validateBook = [
    check("title")
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
        .isNumeric()
        .withMessage("Pages should be a number"),

    (req: Request, res: Response, next: NextFunction) => validateResult(req, res, next)
]