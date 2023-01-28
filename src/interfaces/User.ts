export default interface User{
    _id?: string,
    id?: string,
    name: string,
    lastName?: string,
    userName: string,
    gender: "Masculine" | "Femenine" | "Prefer not say",
    email: string,
    password: string
}