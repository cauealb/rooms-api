import { AppError } from "./app-error.ts";

export class InvalidInputForCreatingAUser extends AppError {
    constructor() {
        super('Invalid input for creating a user!', 400)
    }
}