import { Router } from "express";
import { createAuthor, deleteAuthor, getAllAuthors, getAuthor, updateAuthor } from "../controllers/authorController";
import { validateSesion } from "../middelwares/authentication";
const authorRouter = Router();

//middelwares


// Rutas
authorRouter.get("/", getAllAuthors);
authorRouter.get("/:id", getAuthor);
authorRouter.post("/", validateSesion, createAuthor);
authorRouter.put("/:id", validateSesion, updateAuthor);
authorRouter.delete("/:id", validateSesion, deleteAuthor);

export default authorRouter;