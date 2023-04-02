import { Schema, model } from "mongoose";
import Session from "../interfaces/Session";

const ChangePasswordSchema = new Schema<Session>({
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

export default model("ChangePassword", ChangePasswordSchema);