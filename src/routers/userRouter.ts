import { Router } from "express";
import { createUser, deleteUser, deleteUserBook, getAllUsers, getBooks, getUser, login, updateUser } from "../controllers/userController";
import { validateSesion } from "../middelwares/authentication";

const userRouter = Router();

// routes
userRouter.get("/", getAllUsers);
userRouter.get("/:id", validateSesion, getUser);
userRouter.get("/books", validateSesion, getBooks);
userRouter.post("/", createUser);
userRouter.post("/login", login);
userRouter.put("/:id", validateSesion, updateUser);
userRouter.delete("/:id", validateSesion, deleteUser);
userRouter.delete("/:id/books/:idBook", validateSesion, deleteUserBook);

export default userRouter;