import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../utilities/handleValidators";

export const validateAuthor = [

    check(["name", "country"])
        .exists()
        .isLength({ min: 5, max: 30 }),

    check("lastName")
        .isLength({ max: 30 }),

    check("description")
        .isLength({ max: 300 }),

    (req: Request, res: Response, next: NextFunction) => validateResult(req, res, next)

]