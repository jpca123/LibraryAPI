import { model, Schema } from "mongoose";
import IAuthor from "../interfaces/IAuthor";

const AuthorSchema = new Schema<IAuthor>({
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

export default model<IAuthor>("Author", AuthorSchema);