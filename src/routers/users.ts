import { Router } from "express";
import { deleteUser, deleteUserBook, getAllUsers, getBooks, setBook, getUser,  updateUser } from "../controllers/userController";
import { validateSesion } from "../middelwares/authentication";

const router = Router();

// routes
router.get("/", validateSesion, getAllUsers);
router.get("/books", validateSesion, getBooks);
router.get("/:id", validateSesion, getUser);
router.post("/books", validateSesion, setBook);
router.put("/", validateSesion, updateUser);
router.delete("/books/:bookId", validateSesion, deleteUserBook);
router.delete("/", validateSesion, deleteUser);

export {router};