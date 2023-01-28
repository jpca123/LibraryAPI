import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import User from "./user";

export default interface ReqUserExt extends Request{
    user?: JwtPayload | User;
}