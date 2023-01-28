import User from "../models/User";
import IUser from "../interfaces/user";
import UserBook from "../models/User-Book";
import BookService from "./bookService";
import SecurityService from "./securityService";

export default class UserService{

    private bookService: BookService;
    private securityService: SecurityService;

    constructor(){
        this.bookService = new BookService();
        this.securityService = new SecurityService();
    }

    async login(username: string, password: string){
        if(!username || !password) return null;
        let user = await User.findOne({userName: username});
        if (user === null) return null;

        let userPasswordDecrypted = this.securityService.decrypt(user.password);

        if(password === userPasswordDecrypted){
            let tokenEncrypted = this.securityService.generateToken({userName: user.userName});
            return {
                token: tokenEncrypted
            }
        }
        return null;
    }

    async create(user: IUser){
        // TODO: agregar validaciones y quitar estas de aqui
        let usernameValidation = await this.getByUserName(user.userName);
        if (usernameValidation !== null) return {
            error: "Validation Error",
            message: "The username already exist"
        };
        
        if(!user.password) return null;
        if(user.password.length < 8) return {
            error: "Validation Error",
            message: "The Password must have 8 charaacters how minim"
        };
        
        user.password = this.securityService.encrypt(user.password);
        let userCreated = await User.create(user);
        if (userCreated) return userCreated;
        return null;
    }

    async getAll(page?: number, limit?: number){
        if(!page) page = 1;
        if(!limit) limit = 20;

        let results = await User.find()
        .skip((page - 1)* limit)
        .limit(limit)
        .select(["-password", "-createAt", "-updateAt"]);

        if (results) return results
        return [];
    }

    async getById(id: string){
        let result = await User.findById(id);
        if(result) return result;
        return null;
    }

    async getBooks(id: string){
        let user = User.findById(id);
        if(user === null) return null;
        
        let books = await UserBook.find({userId: id});
        return books;
    }
    async setBook (userId: string, bookId: string){
        let user = await User.findById(userId);
        if(user === null) return null;

        let book = await this.bookService.getById(bookId);
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

    async getByUserName(username: string){
        let result = await User.findOne({userName: username});
        if (result) return result;
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
