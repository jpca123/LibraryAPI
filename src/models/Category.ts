import { Schema, model } from "mongoose";
import Category from "../interfaces/Category";

const CategorySchema = new Schema<Category>({
    category: {
        type: String,
        required: true
    },
}, {
    versionKey: false,
    timestamps: true
})

export default model("Category", CategorySchema);