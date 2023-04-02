import { model, Schema } from "mongoose";
import Author from "../interfaces/Author";

const AuthorSchema = new Schema<Author>({
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
},{
    versionKey: false,
    timestamps: true
},)

export default model("Author", AuthorSchema);