import Book from "../models/Book";
import IBook from "../interfaces/IBook";
import AuthorRepository from "./authorRepository";
import * as fs from "fs";
import path from "path";
import UserBook from "../models/User-Book";

export default class BookRepository {

    private authorRepository: AuthorRepository;
    constructor() {
        this.authorRepository = new AuthorRepository();
    }

    async create(book: IBook) {
        let author = await this.authorRepository.getById(book.authorId);
        if (!author.ok) return { ok: false, errors: [{error: "Not Found", message: "Author not find"}]};

        let bookCreated = await Book.create(book);
        if (bookCreated) return { ok: true, data: bookCreated };
        return {ok: false, errors: [{error: "Creation failed", message: "Creation failed"}]};
    }

    async getAll(page?: number, limit?: number) {
        if (!page) page = 1;
        if (!limit) limit = 20;

        let results = await Book.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .select(["-createdAt", '-updatedAt']);

        let paginator: any = { page, limit, cuantity: null };

        let cuantity: number | undefined = await Book.countDocuments();
        if (cuantity !== undefined) paginator.cuantity = cuantity;

        if (results) return { ok: true, data: results, paginator };
        return { ok: true, data: [] };
    }

    async getById(id: string) {
        let result = await Book.findById(id);
        if (result) return { ok: true, data: result };
        return { ok: false, errors: [{error: "Not Found", message: "Book not found"}] };
    }

    async getByTitle(titleBook: string, page?: number, limit?: number) {
        if (!page) page = 1;
        if (!limit) limit = 20;

        let result = await Book.find({ title: { $regex: titleBook, $options: "i" } })
            .skip((page - 1) * limit)
            .limit(limit)
            .select(["-createdAt", '-updatedAt']);

        let paginator: any = { page, limit, cuantity: null };

        let cuantity: number | undefined = await Book.countDocuments({ title: { $regex: titleBook, $options: "i" } });
        if (cuantity !== undefined) paginator.cuantity = cuantity;

        if (result) return { ok: true, data: result, paginator };
        return { ok: true, data: [] };
    }

    async getByCategory(categoryId: string, page?: number, limit?: number) {
        if (!page) page = 1;
        if (!limit) limit = 20;

        let result = await Book.find({ categoryId })
            .skip((page - 1) * limit)
            .limit(limit)
            .select(["-createdAt", '-updatedAt']);

        let paginator: any = { page, limit, cuantity: null };

        let cuantity: number | undefined = await Book.countDocuments({ categoryId });
        if (cuantity !== undefined) paginator.cuantity = cuantity;

        if (result) return { ok: true, data: result, paginator };
        return { ok: false, data: [] };
    }

    async getByAuthor(authorSearchId: string, page?: number, limit?: number) {
        if (!page) page = 1;
        if (!limit) limit = 20;

        let results = await Book.find({ authorId: authorSearchId })
            .skip((page - 1) * limit)
            .limit(limit)
            .select(["-createdAt", '-updatedAt']);

        let paginator: any = { page, limit, cuantity: null };

        let cuantity: number | undefined = await Book.countDocuments({ authorId: authorSearchId });
        if (cuantity !== undefined) paginator.cuantity = cuantity;

        if (results) return { ok: true, data: results, paginator};
        return { ok: false, data: []};
    }

    async update(id: string, book: IBook) {
        let author = await this.authorRepository.getById(book.authorId);
        if (author === null) return {ok: false, errors: [{error: "Not Found", message: "Author not found"}]};

        let bookSearch = await Book.findById(id);
        if (!bookSearch) return {ok: false, errors: [{error: "Not Found", message: "Book not found"}]};

        if (bookSearch.poster) this.deleteFiles(bookSearch.poster.split("/").pop()!);
        if (bookSearch.document) this.deleteFiles(bookSearch.document.split("/").pop()!);

        Object.assign(bookSearch, book);
        bookSearch.save();

        return { ok: true, data: bookSearch };
    }

    async delete(id: string) {
        let bookSearch = await Book.findById(id);
        if (!bookSearch) return {ok: false, errors: [{error: "Not Found", message: "Book not found"}] };

        if (bookSearch.poster) this.deleteFiles(bookSearch.poster.split("/").pop()!);
        if (bookSearch.document) this.deleteFiles(bookSearch.document.split("/").pop()!);
        let favorites = await UserBook.find({bookId: id});
        favorites.forEach(async (el: any) => await el.remove()); // delete fovorites registers

        bookSearch.remove();
        return { ok: true };
    }

    deleteFiles(pathFile: string) {
        let fullPath: string = path.join(__dirname, '../storage', pathFile);
        try {
            if (fs.existsSync(fullPath)) {
                fs.unlink(fullPath, (err) => {
                    if (err) return console.log('error 1', err.message);
                    console.log(`Path '${fullPath}' has deleted`);
                });
            } else {
                console.log("Can not find path: ", fullPath);
            }
        } catch (err: any) {
            console.log("Delete path fail: ", fullPath, err.message);
        }
    }
}
