import User from "../models/User";
import IUser from "../interfaces/IUser";
import UserBook from "../models/User-Book";
import BookRepository from "./bookRepository";
import SecurityRepository from "./securityRepository";
import { ObjectId } from "mongoose";
import Session from "../models/Session";
import ChangePassword from "../models/ChangePassword";

export default class UserRepository{

    private bookRepository: BookRepository;
    private securityservice: SecurityRepository;

    constructor(){
        this.bookRepository = new BookRepository();
        this.securityservice = new SecurityRepository()
    }

    async getAll(page?: number, limit?: number){
        if(!page) page = 1;
        if(!limit) limit = 20;

        let results = await User.find()
        .skip((page - 1)* limit)
        .limit(limit)
        .select(["-password", "-createdAt", "-updatedAt"]);

        let paginator: any = {page, limit, cuantity: null};

        let cuantity: number | undefined = await User.countDocuments();
        if(cuantity !== undefined) paginator.cuantity = cuantity;

        if (results) return {ok: true, data: results, paginator};
        return {ok: true, data: [], paginator};
    }

    async getById(id: string){
        let result = await User.findById(id)
        .select(["-password", "-createAt", "-updateAt"]);
        if(result) return {ok: true, data: result};
        return {ok: true, errors: [{error: "Not Found", message: "User not found"}] };

    }

    async getByEmail(email: string){
        let result = await User.findOne({email})
        .select(["-password", "-createAt", "-updateAt"]);
        if(result) return {ok: true, data: result};
        return {ok: false, errors: [{error: "Not Found", message: "User not found"}] };

    }

    async getByUserName(username: string){
        let result = await User.findOne({userName: username})
        .select(["-password", "-createAt", "-updateAt"]);
        if (result) return {ok: true, data: result};
        return {ok: false, errors: [{error: "Not Found", message: "User not found"}] };
    }

    async getBooks(id: string, page?: number, limit?: number){
        if(!page) page = 1;
        if(!limit) limit = 20;

        let user = User.findById(id);
        if(user === null) return {ok: false, errors: [{error: "Not Found", message: "User not found"}] };

        let books = await UserBook.find({userId: id})
        .skip((page - 1)* limit)
        .limit(limit)
        .select(["bookId"]);
        
        let paginator: any = { page, limit, cuantity: null };

        let cuantity: number | undefined = await UserBook.countDocuments({userId: id})
        if (cuantity !== undefined) paginator.cuantity = cuantity;
        
        if(books) return {ok: true, data: books, paginator};
        return {ok: true, data: []};
    }
    async setBook (userId: string, bookId: string){
        let user = await User.findById(userId);
        if(user === null) return {ok: false, errors: [{error: "User not found"}] };

        let book = await this.bookRepository.getById(bookId);
        if(book === null) return {ok: false, errors: [{error: "Book not found"}] };

        // validando si el libro ya ha sido añadido
        let bookAdded = await UserBook.findOne({userId, bookId});
        if (bookAdded) return {ok: false, errors: [{error: "Validation Error", message: "Book added already"}] };

        let relation = await UserBook.create({
            userId: userId,
            bookId: bookId,
            date: new Date()
        });

        if (relation) return {ok: true, data: relation};
        return {ok: false, errors: [{error: "Adition failed", message: "Adition failed"}] };
    }

    async deleteUserBook (userId: string, bookId: string){
        let user = await User.findById(userId);
        if(user === null) return {ok: false, errors: [{error: "Not Found", message: "User not found"}] };

        let deleted = await UserBook.findOne({userId, bookId});
        if(deleted) {
            await User.deleteOne({_id: deleted._id});
            return {ok: true};
        } 
        return {ok: false, errors: [{error: "Not Found", message: "Book not found"}] };
    }


    async update(id: string, user: IUser){
        let userWithUserName = await User.findOne({userName: user.userName});
        if(userWithUserName && userWithUserName._id.toString() === id)  return {ok: false, errors: [{error: "Username Error", message: "The username already exists"}] };

        let userWithEmail = await User.findOne({email: user.email});
        if(userWithEmail && userWithEmail._id.toString() === id)  return {ok: false, errors: [{error: "Email Error", message: "The email already exists"}] };

        let userSearch = await User.findById(id);
        if (!userSearch) return {ok: false, errors: [{error: "Not Found", message: "User not found"}] };

        userSearch.name = user.name;
        userSearch.userName = user.userName;
        userSearch.gender = user.gender;
        userSearch.email = user.email;
        userSearch.lastName = user.lastName;
        await userSearch.save();

        userSearch.set("_id", undefined);
        userSearch.set("password", undefined);
        userSearch.set("createdAt", undefined);
        userSearch.set("updatedAt", undefined);

        return {data: userSearch, ok: true};
    }

    async delete(id: string){
        let userSearch = await User.findById(id);
        if(!userSearch) return {ok: false, errors: [{error: "Not Found", message: "User not found"}] };

        let booksUser = await UserBook.find({userId: userSearch._id});

        booksUser.forEach(async rel => await UserBook.findByIdAndRemove(rel._id))

        await Session.findOneAndDelete({userId: id});
        await ChangePassword.findOneAndDelete({userId: id});

        await User.deleteOne({_id: userSearch._id});
        return {ok: true};
    }

}
