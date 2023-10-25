import path from "node:path";
import swaggerJsDoc from "swagger-jsdoc";

const swaggerConfig = {
  definition: {
    openapi: "3.1.1",
    info: {
      title: "Library App",
      version: "1.0.0"
    },
    servers: [
      {url: "http://localhost:3000"},
      {url: "https://libraryapi-production-2f9a.up.railway.app/"}
    ]
  },
  apis: ["./src/docs/*.yaml"],
  
}

export const swaggerDoc = swaggerJsDoc(swaggerConfig);
