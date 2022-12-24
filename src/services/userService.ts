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
        if(!username || !password) throw new Error("The username or password are incorrects");
        console.log(username, password)
        let user = await User.findOne({userName: username});
        if (user === null) throw new Error("Not exist a account with this username");

        console.log(password)

        let userPasswordDecrypted = this.securityService.decrypt(user.password);

        console.log(password, userPasswordDecrypted)
        console.log(password === userPasswordDecrypted)

        if(password === userPasswordDecrypted){
            let encrypt = this.securityService.encrypt(JSON.stringify(user));
            let tokenEncrypted = this.securityService.generateToken({data: encrypt});
            return {
                ok: true,
                token: tokenEncrypted
            }
        }
        throw new Error("The username or password are incorrects");
    }

    async create(user: IUser){
        let usernameValidation = await this.getByUserName(user.userName);
        if (usernameValidation !== null) return null;
        
        if(!user.password) return null;
        if(user.password.length < 8) return null;
        
        user.password = this.securityService.encrypt(user.password);
        let userCreated = await User.create(user);
        if (userCreated) return userCreated;
        return null;
    }

    async getAll(){
        let results = await User.find({});
        if (results) return results
        return [];
    }

    async getById(id: string){
        let result = await User.findById(id);
        if(result) return result;
        return null;
    }

    async getBooks(id: string){
        let user = this.getById(id);
        if(user === null) return null;
        
        let books = await UserBook.find({userId: id});
        return books;
    }
    async setBook (userId: string, bookId: string){
        let user = await this.getById(userId);
        if(user === null) return null;

        let book = await this.bookService.getById(bookId);
        if(book === null) return null;

        let relation = await UserBook.create({
            userId,
            bookId,
            date: new Date()
        });

        if (relation) return relation;
        return null;
    }

    async deleteUserBook (userId: string, bookId: string){
        let user = await this.getById(userId);
        if(user === null) return null;

        let book = await this.bookService.getById(bookId);
        if(book === null) return null;

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
        let userSearch = await this.getById(id);
        if (!userSearch) return null;

        Object.assign(userSearch, user);
        userSearch.save();

        return userSearch;
    }

    async delete(id: string){
        let userSearch = await this.getById(id);
        if(!userSearch) return null;

        userSearch.remove();
        return true;
    }

}
