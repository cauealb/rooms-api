export class AppError extends Error {
    public statusCode: number

    constructor(
        message: string,
        status: number
    ) {
        super(message)
        this.statusCode = status
    }
}