import { AppError } from "./app-error.ts";

export class AReservationCanOnlyBeConfirmedIfItIsPendingError extends AppError {
    constructor() {
        super('A reservation can only be confirmed if it is pending.', 400)
    }
}