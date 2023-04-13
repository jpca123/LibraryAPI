import { model, Schema } from "mongoose";
import IBook from "../interfaces/IBook";

const BookSchema = new Schema<IBook>({
    title: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    pages: {
        type: Number,
        required: false
    },
    document: {
        type: String,
        require: false
    },
    authorId: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        required: true
    }
},{
    versionKey: false,
    timestamps: true
})

export default model<IBook>("Book", BookSchema);