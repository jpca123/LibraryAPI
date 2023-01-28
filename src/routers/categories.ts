import { Router } from "express";
import { validateSesion } from "../middelwares/authentication";
import { getAllCategories, getCategory, createCategory, updateCategory, deleteCategory} from "../controllers/categoryController";
const router = Router();

// Rutas
router.get("/", getAllCategories);
router.get("/:id", getCategory);
router.post("/", validateSesion, createCategory);
router.put("/:id", validateSesion, updateCategory);
router.delete("/:id", validateSesion, deleteCategory);

export {router};