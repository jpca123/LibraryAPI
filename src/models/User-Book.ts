import { Schema, model } from "mongoose";
import UserBook from "../interfaces/User-Book";

const UserBookSchema = new Schema<UserBook>({
    userId: {
        type: String,
        required: true
    },
    bookId: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
})

export default model("UserBook", UserBookSchema);