import { Router } from "express";
import { createAuthor, deleteAuthor, getAllAuthors, getAuthor, updateAuthor } from "../controllers/authorController";
import { validateSesion } from "../middelwares/authentication";
import { validateAuthor } from "../validators/authorValidator";


const router = Router();

//middelwares


// Rutas
router.get("/", getAllAuthors);
router.get("/:id", getAuthor);
router.post("/", validateSesion, validateAuthor, createAuthor);
router.put("/:id", validateSesion, validateAuthor, updateAuthor);
router.delete("/:id", validateSesion, deleteAuthor);

export {router};