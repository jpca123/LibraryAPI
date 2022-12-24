import { Router } from "express";
import { createUser } from "../controllers/userController";

const authRouter = Router();

authRouter.post("/login", createUser);

export default authRouter;