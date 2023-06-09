import Author from "../models/Author";
import IAuthor from "../interfaces/IAuthor";
import Book from "../models/Book";

export default class AuthorRepository{

    async create(author: IAuthor){
        let authorCreated = await Author.create(author);
        if (authorCreated) return {ok: true, data: authorCreated};
        return {ok: false, errors: [new Error("Creation failed")]};
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

        if (results) return {ok: true, data: results, paginator};
        return {ok: false, data: []};
    }

    async getById(id: string){
        let result = await Author.findById(id);
        if(result) return {ok: true, data: result};
        return {ok: false, errors: [{error: "Not Found", message: "Author not found"}]};
    }

    async update(id: string, author: IAuthor){
        let authorSearch = await Author.findById(id);
        if (!authorSearch) return {ok: false, errors: [{Error: "Update Error", message: "Author not found"}]};

        Object.assign(authorSearch, author);
        authorSearch.save();

        return {ok: true, data: authorSearch};
    }

    async delete(id: string){
        let authorSearch = await Author.findById(id);
        if(authorSearch === null) return {ok: false, errors: [{error: "Not Found", message: "Author not found"}]};

        let books = await Book.find({authorId: id});
        console.log({books});
        if(books.length > 0) return { ok: false, errors: [{error: "Restricted", message: "There are books with this author, cannot delete this author, first delete the books with this author"}]}

        authorSearch.remove();
        return {ok: true};
    }
}
