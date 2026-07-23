import { AppError } from "./app-error.ts";

export class InvalidDateFormat extends AppError {
    constructor() {
        super('Invalid date format!', 400)
    }
} 