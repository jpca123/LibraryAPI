import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import User from "./IUser";

export default interface IReqUserExt extends Request{
    user?: JwtPayload | User;
}