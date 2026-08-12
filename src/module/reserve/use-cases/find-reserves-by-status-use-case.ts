import type { reserveRepository } from "../../../repositories/reserve-repository.ts";
import type { Reserve } from "../../../types/reserve.ts";

const statusValid = ['PENDING',  'CONFIRMED', 'CANCELED']

export interface FindReservesByStatusUseCaseRequest {
    status: string
}

export interface FindReservesByStatusUseCaseResponse {
    reserves: Reserve[]
}


export class FindReservesByStatusUseCase {
    private readonly reserveRepository: reserveRepository;

    constructor(repository: reserveRepository) {
        this.reserveRepository = repository
    }

    async execute({ status }: FindReservesByStatusUseCaseRequest): Promise<FindReservesByStatusUseCaseResponse> {
        if(!statusValid.includes(status)) {
            throw new Error()
        }

        const reserves = await this.reserveRepository.findReservesByStatus(status)

        return { reserves }
    }
}