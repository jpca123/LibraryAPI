"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const example_1 = require("./routers/example");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.get("/", (req, res) => {
    console.log(req.method);
    res.send("hello world");
});
app.use("/xp", example_1.routerExample);
app.listen(PORT, () => {
    console.log("Server listen in http://localhost:3000");
});
