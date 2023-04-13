import { Schema, model } from "mongoose";
import ISession from "../interfaces/ISession";

const ChangePasswordSchema = new Schema<ISession>({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    }
}, {
    versionKey: false,
    timestamps: true
})

export default model<ISession>("ChangePassword", ChangePasswordSchema);