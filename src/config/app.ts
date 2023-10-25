import express, { Request, Response, Express } from "express";
import { env } from "process";
import router from "../routers";
import cors from "cors";
import path from "path";
import { config } from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { swaggerDoc } from "./swaggerDocs";
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
app.use(express.static(path.join(__dirname, "../storage")));

// Swagger documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

//routers
app.use(router);
app.get("/", (req: Request, res: Response) => {
  console.log(req.url, req.baseUrl, req.hostname, req.originalUrl)
  console.log({urlBild: `${new URL(`${req.protocol}:${req.headers.host!}/api-docs` )}`})
  let data: any = {
    name: "Library App",
    description: "Project to manage a library with a Rest API",
    documentation: new URL(`${req.protocol}:${req.headers.host!}/api-docs` ),
    version: "1.0.0",
  };
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server listen in http://localhost:${PORT}...`);
});

export default app;