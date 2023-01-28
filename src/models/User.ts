import { model, Schema } from "mongoose";
import User from "../interfaces/user";

const UserSchema = new Schema<User>({
    id: {
        type: String,
        required: false
    },
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

export default model("User", UserSchema);