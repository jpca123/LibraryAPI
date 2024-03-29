import { Router } from "express";
import { register, login, logout, validSession, forgotPassword, changePassword } from "../controllers/authController";
import { validateSesion } from "../middelwares/authentication";
import { validateUser } from "../validators/userValidator";

const router = Router();

router.post("/register", validateUser, register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/validSession", validSession);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", changePassword);


export {router};