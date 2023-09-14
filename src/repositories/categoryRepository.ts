import Category from "../models/Category";
import ICategory from "../interfaces/ICategory";
import Book from "../models/Book";

export default class CategoryRepository {

    async create(category: ICategory) {
        let categoryCreated = await Category.create(category);
        if (categoryCreated) return { ok: true, data: categoryCreated };
        return { ok: false, errors: [{ error: "Creation failed", message: "Creation failed" }] };
    }

    async getAll(page?: number, limit?: number) {
        if (!page) page = 1;
        if (!limit) limit = 20;

        let results = await Category.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .select(['-createdAt', "-updatedAt"]);

        let paginator: any = { page, skip: limit, cuantity: null };

        let cuantity: number | undefined = await Category.countDocuments();
        if (cuantity !== undefined) paginator.cuantity = cuantity;

        if (results) return { ok: true, data: results, paginator };
        return { ok: true, data: [] };
    }

    async getById(id: string) {
        let result = await Category.findById(id)
            .select(['-createdAt', "-updatedAt"]);

        if (result) return { ok: true, data: result };
        return { ok: false, errors: [{ error: "Not Found", message: "Category not found" }] };
    }

    async update(id: string, category: ICategory) {
        let categorySearch = await Category.findById(id);
        if (!categorySearch) return { ok: false, errors: [{ error: "Not Found", message: "Category not found" }] };


        Object.assign(categorySearch, category);
        categorySearch.save();

        return { ok: true, data: categorySearch };
    }

    async delete(id: string) {
        let categorySearch = await Category.findById(id);
        if (categorySearch === null) return { ok: false, errors: [{ error: "Not Found", message: "Category not found" }] };

        let books = await Book.find({categoryId: id});
        if(books.length > 0) return { ok: false, errors: [{error: "Restricted", message: "There are books with this category, cannot delete this category, first delete the books with this category"}]}

        await Category.findOne({_id: categorySearch._id});
        return { ok: true };
    }
}
