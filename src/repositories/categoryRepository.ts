import Category from "../models/Category";
import ICategory from "../interfaces/ICategory";

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

        categorySearch.remove();
        return { ok: true };
    }
}
