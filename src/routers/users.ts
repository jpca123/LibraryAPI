import { Router } from "express";
import { deleteUser, deleteUserBook, getAllUsers, getBooks, setBook, getUser,  updateUser } from "../controllers/userController";
import { validateSesion } from "../middelwares/authentication";

const router = Router();

// routes
router.get("/", validateSesion, getUser);
router.get("/all", validateSesion, getAllUsers);
router.get("/books", validateSesion, getBooks);
router.post("/books", validateSesion, setBook);
router.put("/", validateSesion, updateUser);
router.delete("/books/:bookId", validateSesion, deleteUserBook);
router.delete("/", validateSesion, deleteUser);

export {router};