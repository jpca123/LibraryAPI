import { Schema, model } from "mongoose";
import ICategory from "../interfaces/ICategory";

const CategorySchema = new Schema<ICategory>({
    category: {
        type: String,
        required: true
    },
}, {
    versionKey: false,
    timestamps: true
})

export default model<ICategory>("Category", CategorySchema);