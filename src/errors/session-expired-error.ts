import { AppError } from "./app-error.ts";

export class SessionExpiredError extends AppError {
    constructor() {
        super('Session expired!', 401)
    }
}