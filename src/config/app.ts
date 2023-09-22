import express, { Request, Response, Express } from "express";
import { env } from "process";
import router from "../routers";
import cors from "cors";
import path from "path";
import { config } from "dotenv";

if (env.NODE_ENV !== "production") {
  config()
  console.log("load .env variables", {port: env.PORT});
}

const app = express();
const PORT = env.PORT || 3800;

// middelwares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/storage")));

//routers
app.use(router);
app.get("/", (req: Request, res: Response) => {
  let data: any = {
    name: "Library App",
    description: "Project to manage a library with a Rest API",
    version: 1,
  };
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server listen in http://localhost:${PORT}...`);
});

export default app;