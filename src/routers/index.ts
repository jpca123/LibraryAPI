import { Router } from "express";
import fs from "fs";

const Routes = Router();

let pathDir: string = __dirname;

let listRoutes: string[] = fs.readdirSync(pathDir);

listRoutes.map(el =>{
    let path = el.split(".").shift();
    if(path === "index") return;
    import(`./${path}`)
    .then(module=>{
        let {router} = module;
        Routes.use(`/${path}`, router);
    })
})

export default Routes;