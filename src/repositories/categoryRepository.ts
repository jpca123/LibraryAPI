import Category from "../models/Category";
import ICategory from "../interfaces/ICategory";

export default class CategoryRepository{

    async create(category: ICategory){
        let categoryCreated = await Category.create(category);
        if (categoryCreated) return {data: categoryCreated};
        return null;
    }

    async getAll(page?: number, limit?: number){
        if (!page) page = 1;
        if (!limit) limit = 20;

        let results = await Category.find()
        .skip((page -1) * limit)
        .limit(limit)
        .select(['-createdAt', "-updatedAt"]);

        let paginator: any = {page, skip: limit, cuantity: null};

        let cuantity: number | undefined = await Category.countDocuments();
        if(cuantity !== undefined) paginator.cuantity = cuantity;

        if (results) return {data: results, paginator};
        return [];
    }

    async getById(id: string){
        let result = await Category.findById(id)
        .select(['-createdAt', "-updatedAt"]);

        if(result) return {data: result};
        return null;
    }

    async update(id: string, category: ICategory){
        let categorySearch = await Category.findById(id);
        if (!categorySearch) return null;

        Object.assign(categorySearch, category);
        categorySearch.save();

        return {data: categorySearch};
    }

    async delete(id: string){
        let categorySearch = await Category.findById(id);
        if(categorySearch === null) return null;

        categorySearch.remove();
        return {ok: true};
    }
}
