import {Router} from "express";
import { createBook, deleteBook, getAllBooks, getBook,  getBookByAuthor,  getBookByCategory,  updateBook } from "../controllers/bookController";
import { validateSesion } from "../middelwares/authentication";
import uploadMiddelware from "../middelwares/storageMiddelware";

const router = Router();

let filesUpload = [{name: "poster", maxCount: 1},{name: 'document', maxCount: 1}];

// rutas
router.get("/", getAllBooks);
router.get("/author/:id", getBookByAuthor);
router.get("/category/:id", getBookByCategory);
router.get("/:id", getBook);
router.post("/", validateSesion, uploadMiddelware.fields(filesUpload), createBook);
router.put("/:id", validateSesion, uploadMiddelware.fields(filesUpload), updateBook);
router.delete("/:id", validateSesion, deleteBook);

export {router};