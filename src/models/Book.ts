import { model, Schema } from "mongoose";
import Book from "../interfaces/book";

const BookSchema = new Schema<Book>({
    id: {
        type: String,
        required: false
    },
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

export default model("Book", BookSchema);