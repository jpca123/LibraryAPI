import Author from "../models/Author";
import IAuthor from "../interfaces/IAuthor";

export default class AuthorRepository{

    async create(author: IAuthor){
        let authorCreated = await Author.create(author);
        if (authorCreated) return {data: authorCreated};
        return null;
    }

    async getAll(page?: number, limit?: number){
        if(!page) page = 1;
        if(!limit) limit = 20;

        let results = await Author.find()
        .skip((page - 1)* limit)
        .limit(limit)
        .select(["-createAt", "-updateAt"]);

        let paginator: any = {page, limit, cuantity: null};

        let cuantity: number | undefined = await Author.countDocuments();
        if(cuantity !== undefined) paginator.cuantity = cuantity;

        if (results) return {data: results, paginator};
        return [];
    }

    async getById(id: string){
        let result = await Author.findById(id);
        if(result) return {data: result};
        return null;
    }

    async update(id: string, author: IAuthor){
        let authorSearch = await Author.findById(id);
        if (!authorSearch) return null;

        Object.assign(authorSearch, author);
        authorSearch.save();

        return {data: authorSearch};
    }

    async delete(id: string){
        let authorSearch = await Author.findById(id);
        if(authorSearch === null) return null;

        authorSearch.remove();
        return {ok: true};
    }
}
