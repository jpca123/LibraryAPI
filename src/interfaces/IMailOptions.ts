export default interface IMailOptions{
    from: string,
    to: string,
    subject: string,
    text: string,
    html?: string
}