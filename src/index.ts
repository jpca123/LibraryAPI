import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { env, cwd } from "process";
import router from "./routers";
import {config} from "dotenv";
import cors from "cors";
import path from "path";


if(env.NODE_ENV !== "production"){
    config();
}

const app = express();
const PORT = env.PORT || 3800;


// middelwares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "/storage")));


//routers
app.use(router);

// mongoDB connection

mongoose.connect(env.MONGO_LOCAL_URI!)
.then(()=> console.log("MongoDB run (Local)"))
.catch((err: any) => {
    console.log("fallo la conexion a mongoDB");
    console.log(err.message);
})

// routes
app.get("/", (req: Request, res: Response)=>{
    let data: any = {
        name: "Library App",
        description: "Project to manage a library with a Rest API",
        version: 1
    }
    res.json(data);
})


app.listen(PORT, ()=>{
console.log(`Server listen in http://localhost:${PORT}...`);
})
