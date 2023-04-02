import { Router } from "express";
import { register, login, logout, validSession, forgotPassword, changePassword } from "../controllers/authController";
import { validateSesion } from "../middelwares/authentication";
import { validateUser } from "../validators/userValidator";

const router = Router();

// router.post("/register", validateUser, register); TODO: para cuando arregle las validaciones
router.post("/register", register); 
router.post("/login", login);
router.post("/logout", validateSesion, logout);
router.post("/validSession", validSession);
router.post("/forgot_password", forgotPassword);
router.put("/reset_password/:token", changePassword);


export {router};