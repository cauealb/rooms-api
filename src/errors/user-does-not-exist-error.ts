import { AppError } from "./app-error.ts";

export class UserDoesNotExistError extends AppError {
    constructor() {
        super('User does not exist!', 404)
    }
}