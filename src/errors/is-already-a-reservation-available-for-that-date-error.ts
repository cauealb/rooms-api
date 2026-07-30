import { AppError } from "./app-error.ts";

export class IsAlreadyAReservationAvailableForThatDateError extends AppError {
    constructor() {
        super('There is already a reservation available for that date.', 400)
    }
}