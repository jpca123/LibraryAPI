import { Router } from "express";
import { createUser, deleteUser, deleteUserBook, getAllUsers, getBooks, setBook, getUser,  updateUser } from "../controllers/userController";
import { validateSesion } from "../middelwares/authentication";

const router = Router();

// routes
router.get("/", getAllUsers);
// router.get("/", validateSesion, getAllUsers);
router.get("/books", validateSesion, getBooks);
router.get("/:id", validateSesion, getUser);
router.post("/books", validateSesion, setBook);
router.put("/:id", validateSesion, updateUser);
router.delete("/books/:bookId", validateSesion, deleteUserBook);
router.delete("/:id", validateSesion, deleteUser);

export {router};