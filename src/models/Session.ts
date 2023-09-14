import { Schema, model } from "mongoose";
import ISession from "../interfaces/ISession";

const UserBookSchema = new Schema<ISession>({
    userId: {
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

export default model<ISession>("Session", UserBookSchema);