import { AppError } from "./app-error.ts";

export class ReservationHasAlreadyBeenCancelledError extends AppError {
    constructor() {
        super('This reservation has already been cancelled!', 400)
    }
}