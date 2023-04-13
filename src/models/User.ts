import { model, Schema } from "mongoose";
import IUser from "../interfaces/IUser";

const UserSchema = new Schema<IUser>({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Masculine", "Femenine", "Prefer not say"]
    }
}, {
    versionKey: false,
    timestamps: true
})

export default model<IUser>("User", UserSchema);