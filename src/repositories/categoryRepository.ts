import Category from "../models/Category";
import ICategory from "../interfaces/ICategory";

export default class CategoryRepository{

    async create(category: ICategory){
        let categoryCreated = await Category.create(category);
        if (categoryCreated) return categoryCreated;
        return null;
    }

    async getAll(page?: number, limit?: number){
        if (!page) page = 1;
        if (!limit) limit = 20;

        let results = await Category.find()
        .skip((page -1) * limit)
        .limit(limit)
        .select(['-createAt', "-updateAt"]);

        if (results) return {data: results};
        return {data: []};
    }

    async getById(id: string){
        let result = await Category.findById(id);
        if(result) return result;
        return null;
    }

    async update(id: string, category: ICategory){
        let categorySearch = await this.getById(id);
        if (!categorySearch) return null;

        Object.assign(categorySearch, category);
        categorySearch.save();

        return categorySearch;
    }

    async delete(id: string){
        let categorySearch = await this.getById(id);
        if(categorySearch === null) return null;

        categorySearch.remove();
        return true;
    }
}
