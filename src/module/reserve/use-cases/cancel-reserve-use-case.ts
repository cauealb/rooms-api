import { ReserveDoesNotExistError } from "../../../errors/reserve-does-not-exist-error.ts";
import type { reserveRepository } from "../../../repositories/reserve-repository.ts";
import type { Reserve } from "../../../types/reserve.ts";

export interface CancelReserveUseCaseRequest {
    idReserve: string
}

export interface CancelReserveUseCaseResponse {
    reserve: Reserve
}

export class CancelReserveUseCase {
    private readonly reserveRepository: reserveRepository

    constructor(repository: reserveRepository) {
        this.reserveRepository = repository
    }

    async execute({ idReserve }: CancelReserveUseCaseRequest): Promise<CancelReserveUseCaseResponse> {
        const isReserveExist = await this.reserveRepository.findById(idReserve)
        if(!isReserveExist) {
            throw new ReserveDoesNotExistError()
        }

        const reserve = await this.reserveRepository.cancelReservation(idReserve);

        return { reserve }
    }
}