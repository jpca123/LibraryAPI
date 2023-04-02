import {NextFunction, Request, Response, Router} from "express";
import { createBook, deleteBook, getAllBooks, getBook,  getBookByAuthor,  getBookByCategory,  updateBook } from "../controllers/bookController";
import { validateSesion } from "../middelwares/authentication";
import uploadMiddelware from "../middelwares/storageMiddelware";
import { validateBook } from "../validators/bookValidator";

const router = Router();

let filesUpload = [{name: "poster", maxCount: 1},{name: 'document', maxCount: 1}];

// rutas
router.get("/", getAllBooks);
router.get("/author/:id", getBookByAuthor);
router.get("/category/:id", getBookByCategory);
router.get("/:id", getBook);
// router.post("/", validateSesion, validateBook, uploadMiddelware.fields(filesUpload), createBook);
router.put("/:id", validateSesion, validateBook, uploadMiddelware.fields(filesUpload), updateBook);
router.delete("/:id", validateSesion, deleteBook);


// validacion de datos 
async function logBody(req: Request, res: Response, next: NextFunction){
    console.log(req.body)
    console.log(req.files)
    return next()
}

router.post("/", logBody, validateBook, createBook); // PARA TEST DE VALIDACIONES


export {router};