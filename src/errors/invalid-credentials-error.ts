import { AppError } from "./app-error.ts";

export class InvalidCredentialsError extends AppError {
    constructor() {
        super('Invalid credentials!', 401)
    }
}
