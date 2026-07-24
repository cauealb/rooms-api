import { AppError } from "./app-error.ts";

export class ReserveDoesNotExistError extends AppError {
    constructor() {
        super('Reserve does not exist!', 404)
    }
}