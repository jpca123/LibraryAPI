import Author from "../models/Author";
import IAuthor from "../interfaces/IAuthor";

export default class AuthorRepository{

    async create(author: IAuthor){
        let authorCreated = await Author.create(author);
        if (authorCreated) return authorCreated;
        return null;
    }

    async getAll(page?: number, limit?: number){
        if(!page) page = 1;
        if(!limit) limit = 20;

        let results = await Author.find()
        .skip((page - 1)* limit)
        .limit(limit)
        .select(["-createAt", "-updateAt"]);
        if (results) return results;
        return [];
    }

    async getById(id: string){
        let result = await Author.findById(id);
        if(result) return result;
        return null;
    }

    async update(id: string, author: IAuthor){
        let authorSearch = await this.getById(id);
        if (!authorSearch) return null;

        Object.assign(authorSearch, author);
        authorSearch.save();

        return authorSearch;
    }

    async delete(id: string){
        let authorSearch = await this.getById(id);
        if(authorSearch === null) return null;

        authorSearch.remove();
        return true;
    }
}
