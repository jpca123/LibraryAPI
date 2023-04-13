import { Schema, model } from "mongoose";
import IUserBook from "../interfaces/IUser-Book";

const UserBookSchema = new Schema<IUserBook>({
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

export default model<IUserBook>("UserBook", UserBookSchema);