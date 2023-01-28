import { Request } from "express";
import multer from "multer";

let storage = multer.diskStorage({
    destination(req: Request, file: Express.Multer.File, cb: any){
        cb(null,  `${process.cwd()}/storage`);
    },
    filename(req: Request, file: Express.Multer.File, cb: any){
        let ext = file.originalname.split(".").pop();
        let filename = `file_${Date.now()}.${ext}`;
        cb(null, filename);
    }
})

let uploadMiddelware = multer({storage});
export default uploadMiddelware