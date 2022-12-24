"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerExample = void 0;
const express_1 = require("express");
exports.routerExample = (0, express_1.Router)();
exports.routerExample.get("/", (req, res) => {
    console.log(req.method, req.url);
    res.json("hello from example router");
});
