import { InvalidDateFormat } from "../../../errors/invalid-date-format-error.ts";
import type { reserveRepository } from "../../../repositories/reserve-repository.ts";
import type { Reserve } from "../../../types/reserve.ts";

export interface FindReservesBetweenDatesRequest {
    startAt: string
    endAt: string
}

export interface FindReservesBetweenDatesResponse {
    reserves: Reserve[]
}

export class FindReservesBetweenDates {
    private readonly reserveRepository: reserveRepository

    constructor(repository: reserveRepository) {
        this.reserveRepository = repository
    }

    async execute({ startAt, endAt }: FindReservesBetweenDatesRequest): Promise<FindReservesBetweenDatesResponse> {
        const dateStartOf = new Date(startAt)
        const dateEndOf = new Date(endAt)

        if(isNaN(dateStartOf.getTime()) || isNaN(dateEndOf.getTime())) {
            throw new InvalidDateFormat()
        }

        if(dateStartOf > dateEndOf) {
            throw new InvalidDateFormat()
        }

        const reserves = await this.reserveRepository.findReservesBetweenDates(dateStartOf, dateEndOf);

        return { reserves }

    }
}