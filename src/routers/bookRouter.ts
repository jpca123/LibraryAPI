import {Router} from "express";
import { createBook, deleteBook, getAllBooks, getBook,  getBookByAuthor,  updateBook } from "../controllers/bookController";
import { validateSesion } from "../middelwares/authentication";

const bookRouter = Router();

// rutas
bookRouter.get("/", getAllBooks);
bookRouter.get("/:id", getBook);
bookRouter.get("/author/:id", getBookByAuthor);
bookRouter.post("/", validateSesion, createBook);
bookRouter.put("/:id", validateSesion, updateBook);
bookRouter.delete("/:id", validateSesion, deleteBook);

export default bookRouter;