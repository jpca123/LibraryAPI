import Book from "../models/Book";
import IBook from "../interfaces/book";
import AuthorService from "./authorService";

export default class BookService{

    private authorService: AuthorService;
    constructor(){
        this.authorService = new AuthorService();
    }

    async create(book: IBook){
        let author = await this.authorService.getById(book.authorId);
        if(author === null) return null;

        let bookCreated = await Book.create(book);
        if (bookCreated) return bookCreated;
        return null;
    }

    async getAll(page?: number, limit?: number){
        if (!page) page = 1;
        if(!limit) limit = 20;

        let results = await Book.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .select(["-createdAt", '-updatedAt']);

        if (results) return results;
        return [];
    }

    async getById(id: string){
        let result = await Book.findById(id);
        if(result) return result;
        return null;
    }

    async getByTitle(titleBook: string){
        let result = await Book.find({title: titleBook});
        if (result) return result;
        return null;
    }

    async getByCategory(categoryId: string, page?: number, limit?: number){
        if (!page) page = 1;
        if(!limit) limit = 20;

        let result = await Book.find({categoryId})
        .skip((page - 1) * limit)
        .limit(limit)
        .select(["-createdAt", '-updatedAt']);
        if (result) return result;
        return null;
    }

    async getByAuthor(authorSearchId: string){
        let books = await Book.find({authorId: authorSearchId});
        if(books) return books;
        return [];
    }

    async update(id: string, book: IBook){
        let author = await this.authorService.getById(book.authorId);
        if(author === null) return null;
        
        let bookSearch = await this.getById(id);
        if (!bookSearch) return null;

        Object.assign(bookSearch, book);
        bookSearch.save();

        return bookSearch;
    }

    async delete(id: string){
        let bookSearch = await this.getById(id);
        if(!bookSearch) return null;

        bookSearch.remove();
        return true;
    }
}
