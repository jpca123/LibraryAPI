import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../utilities/handleValidators";

export const validateUser = [
    check(["name", "userName"])
        .exists()
        .isLength({ min: 5, max: 50 }),

    check("gender")
        .exists()
        .isIn(["Masculine", "Femenine", "Prefer not say"]),

    check("password")
        .exists()
        .isLength({ min: 6, max: 15 }),

    check("email")
        .exists()
        .isEmail(),

    check("lastName")
        .isLength({ max: 50 }),

    (req: Request, res: Response, next: NextFunction) => validateResult(req, res, next)

]