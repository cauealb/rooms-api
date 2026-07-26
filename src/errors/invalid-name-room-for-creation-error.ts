import { AppError } from "./app-error.ts";

export class InvalidNameRoomForCreatioError extends AppError {
    constructor() {
        super('Invalid room name for creation!', 404)
    }
}