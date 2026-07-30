import { AppError } from "./app-error.ts";

export class RoomDoesNotExistError extends AppError {
    constructor() {
        super('Room does not exist', 404)
    }
}