import { Router } from "express";
import { createAuthor, deleteAuthor, getAllAuthors, getAuthor, updateAuthor } from "../controllers/authorController";
import { validateSesion } from "../middelwares/authentication";
const router = Router();

//middelwares


// Rutas
router.get("/", getAllAuthors);
router.get("/:id", getAuthor);
router.post("/", validateSesion, createAuthor);
router.put("/:id", validateSesion, updateAuthor);
router.delete("/:id", validateSesion, deleteAuthor);

export {router};