import Book from "../models/Book";
import IBook from "../interfaces/IBook";
import AuthorRepository from "./authorRepository";

export default class BookRepository {

    private authorRepository: AuthorRepository;
    constructor() {
        this.authorRepository = new AuthorRepository();
    }

    async create(book: IBook) {
        let author = await this.authorRepository.getById(book.authorId);
        if (author === null) return null;

        let bookCreated = await Book.create(book);
        if (bookCreated) return { data: bookCreated };
        return null;
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

        if (results) return { data: results, paginator };
        return [];
    }

    async getById(id: string) {
        let result = await Book.findById(id);
        if (result) return { data: result };
        return null;
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

        if (result) return { data: result, paginator };
        return null;
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

        if (result) return { data: result, paginator };
        return [];
    }

    async getByAuthor(authorSearchId: string) {
        let books = await Book.find({ authorId: authorSearchId });
        if (books) return { data: books };
        return [];
    }

    async update(id: string, book: IBook) {
        let author = await this.authorRepository.getById(book.authorId);
        if (author === null) return null;

        let bookSearch = await Book.findById(id);
        if (!bookSearch) return null;

        Object.assign(bookSearch, book);
        bookSearch.save();

        return { data: bookSearch };
    }

    async delete(id: string) {
        let bookSearch = await Book.findById(id);
        if (!bookSearch) return null;

        bookSearch.remove();
        return { ok: true };
    }
}
