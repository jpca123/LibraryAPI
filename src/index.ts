import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { env, cwd } from "process";
import router from "./routers";
import {config} from "dotenv";

if(env.NODE_ENV !== "production"){
    config();
}

const app = express();
const PORT = env.PORT || 3800;


// middelwares
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(`${cwd()}/storage`));


//routers
app.use(router);

// db mongo connection

// mongoose.connect(env.MONGO_URI || "")
mongoose.connect(env.MONGO_LOCAL_URI || "")
.then(()=> console.log("MongoDB run (Local)"))
.catch(err => {
    console.log("fallo la conexion a mongoDB");
    console.log(err);
})
// routes
app.get("/", (req: Request, res: Response)=>{
    res.send("Welcome to Library App, a Rest API for admin a simple library");
})


app.listen(PORT, ()=>{
console.log(`Server listen in http://localhost:${PORT}...`);
})
