import type { reserveRepository } from "../../../repositories/reserve-repository.ts";
import type { Reserve } from "../../../types/reserve.ts";

export interface FindPaginatedReserveUseCaseRequest {
    page: number
}

export interface FindPaginatedReserveUseCaseResponse {
    reserves: Reserve[]
}

export class FindPaginatedReserveUseCase {
    private readonly reserveRepository: reserveRepository

    constructor(repository: reserveRepository) {
        this.reserveRepository = repository
    }

    async execute({ page }: FindPaginatedReserveUseCaseRequest): Promise<FindPaginatedReserveUseCaseResponse> {
        const reserves = await this.reserveRepository.findPaginatedReservations(page)

        return { reserves }
    }
}