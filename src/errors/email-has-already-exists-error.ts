import { AppError } from "./app-error.ts";

export class EmailHasAlredyExistsError extends AppError {
    constructor() {
        super('Email has alredy exists', 400)
    }
}