import type { reserveRepository } from "../../../repositories/reserve-repository.ts";
import type { Reserve, ReserveCreate } from "../../../types/reserve.ts";

export interface CreateReserveUseCaseRequest {
    idRoom: string,
    idUser: string,
    startOfReserve: string
    endOfReserve: string
}

export interface CreateReserveUseCaseResponse {
    reserve: Reserve
}

export class CreateReserveUseCase {
    private readonly reserveRepository: reserveRepository

    constructor(repository: reserveRepository) {
        this.reserveRepository = repository
    }

    async execute(data: CreateReserveUseCaseRequest): Promise<CreateReserveUseCaseResponse> {
        const dateStartOfReserve = new Date(data.startOfReserve);
        const dateEndOfReserve = new Date(data.endOfReserve);

        if(isNaN(dateStartOfReserve.getTime()) || isNaN(dateEndOfReserve.getTime())) {
            throw new Error()
        }

        const dataReserve: ReserveCreate = {
           idRoom: data.idRoom,
           idUser: data.idUser,
           startOfReserve: dateStartOfReserve,
           endOfReserve: dateEndOfReserve
        }

        const reserve = await this.reserveRepository.create(dataReserve)
        return { reserve }
    }
}