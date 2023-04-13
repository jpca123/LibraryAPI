import User from "../models/User";
import IUser from "../interfaces/IUser";
import UserBook from "../models/User-Book";
import BookRepository from "./bookRepository";
import SecurityRepository from "./securityRepository";

export default class UserRepository{

    private bookRepository: BookRepository;

    constructor(){
        this.bookRepository = new BookRepository();
    }

    async getAll(page?: number, limit?: number){
        if(!page) page = 1;
        if(!limit) limit = 20;

        let results = await User.find()
        .skip((page - 1)* limit)
        .limit(limit)
        .select(["-password", "-createAt", "-updateAt"]);

        if (results) return {data: results};
        return {data: []};
    }

    async getById(id: string){
        let result = await User.findById(id);
        if(result) return result;
        return null;
    }

    async getByEmail(email: string){
        let result = await User.findOne({email});
        if(result) return result;
        return null;
    }

    async getByUserName(username: string){
        let result = await User.findOne({userName: username});
        if (result) return result;
        return null;
    }

    async getBooks(id: string, page?: number, limit?: number){
        if(!page) page = 1;
        if(!limit) limit = 20;

        let user = User.findById(id)
        .skip((page - 1)* limit)
        .limit(limit)
        .select(["-password", "-createAt", "-updateAt"]);
        if(user === null) return null;
        
        let books = await UserBook.find({userId: id});
        return {data: books};
    }
    async setBook (userId: string, bookId: string){
        let user = await User.findById(userId);
        if(user === null) return null;

        let book = await this.bookRepository.getById(bookId);
        if(book === null) return null;

        // validando si el libro ya ha sido añadido
        let bookAdded = await UserBook.findOne({userId, bookId});
        if (bookAdded) return null;

        let relation = await UserBook.create({
            userId: userId,
            bookId: bookId,
            date: new Date()
        });

        if (relation) return relation;
        return null;
    }

    async deleteUserBook (userId: string, bookId: string){
        let user = await User.findById(userId);
        if(user === null) return null;

        let deleted = await UserBook.findOne({userId, bookId});
        if(deleted) {
            await deleted.remove();
            return true;
        } 
        return null;
    }


    async update(id: string, user: IUser){
        let userSearch = await User.findById(id);
        if (!userSearch) return null;

        Object.assign(userSearch, user);
        userSearch.save();

        return userSearch;
    }

    async delete(id: string){
        let userSearch = await User.findById(id);
        if(!userSearch) return null;

        userSearch.remove();
        return true;
    }

}
