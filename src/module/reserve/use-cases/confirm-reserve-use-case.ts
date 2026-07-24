import { ReserveDoesNotExistError } from "../../../errors/reserve-does-not-exist-error.ts";
import type { reserveRepository } from "../../../repositories/reserve-repository.ts";
import type { Reserve } from "../../../types/reserve.ts";

export interface ConfirmReserveUseCaseRequest {
    idUser: string,
    idReserve: string
    idRoom: string
}

export interface ConfirmReserveUseCaseResponse {
    reserve: Reserve
}

export class ConfirmReserveUseCase {
    private readonly reserveRepository: reserveRepository

    constructor(repository: reserveRepository) {
        this.reserveRepository = repository
    }

    async execute({ idUser, idReserve, idRoom }: ConfirmReserveUseCaseRequest): Promise<ConfirmReserveUseCaseResponse> {
        const isReserveExist = await this.reserveRepository.findById(idReserve);
        if(!isReserveExist) {
            throw new ReserveDoesNotExistError()
        }

        if(isReserveExist.status !== 'PENDING') {
            throw new Error()
        }

        const reserve = await this.reserveRepository.confirmReservation(idReserve);
        return { reserve }
    }
}