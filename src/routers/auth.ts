import { Router } from "express";
import { createUser, login } from "../controllers/userController";

const router = Router();

router.post("/register", createUser);
router.post("/login", login);

export {router};