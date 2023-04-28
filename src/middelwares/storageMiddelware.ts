import { Request } from "express";
import multer from "multer";

let storage = multer.diskStorage({
    destination(req: Request, file: Express.Multer.File, cb: any) {
        cb(null, `${process.cwd()}/storage`);
    },
    filename(req: Request, file: Express.Multer.File, cb: any) {
        let ext = file.originalname.split(".").pop();
        let filename = `file_${Date.now()}.${ext}`;
        cb(null, filename);
    }
})

let uploadMiddelware = multer({
    storage,
    fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
        if(file.fieldname === "poster"){
            if(file.mimetype.includes("image/")) return cb(null, true);
            return cb(null, false);
            
        }

        if(file.fieldname === "document"){
            if(file.mimetype.includes("pdf")) return cb(null, true);
            return cb(null, false);
        }
    },
    limits: { fieldSize: 50*1024*1024 }
});
export default uploadMiddelware;