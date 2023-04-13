export default interface IBook{
    title: string,
    poster?: string,
    description?: string,
    date?: Date,
    pages?: number,
    document?: string,
    categoryId: string,
    authorId: string
}