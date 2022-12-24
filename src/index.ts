import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { env } from "process";
import authorRouter from "./routers/authorRouter";
import authRouter from "./routers/authRouter";
import bookRouter from "./routers/bookRouter";
import userRouter from "./routers/userRouter";

const app = express();
const PORT = env.PORT || 3000;


// middelwares
app.use(express.json());


//routers
app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/authors", authorRouter);
app.use("/auth", authRouter);

// db mongo connection
mongoose.connect("mongodb+srv://jpca:Naruto_Uzumaki_7@library.boc0hsr.mongodb.net/test").then(()=> console.log("MongoDB run"));

// routes
app.get("/", (req: Request, res: Response)=>{
    res.send("Welcome to Library App, a Rest API for admin a simple library");
})


app.listen(PORT, ()=>{
    console.log("Server listen in http://localhost:3000...");
})
