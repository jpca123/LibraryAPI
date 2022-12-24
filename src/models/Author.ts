import { model, Schema } from "mongoose";
import Author from "../interfaces/Author";

const AuthorSchema = new Schema<Author>({
    id: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
},)

export default model("Author", AuthorSchema);