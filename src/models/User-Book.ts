import { Schema, model } from "mongoose";
import UserBook from "../interfaces/User-Book";

const UserBookSchema = new Schema<UserBook>({
    id: {
        type: String,
        required: false
    },
    userId: {
        type: String,
        required: true
    },
    bookId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
})

export default model("UserBook", UserBookSchema);