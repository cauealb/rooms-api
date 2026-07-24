import { InvalidDateFormat } from "../../../errors/invalid-date-format-error.ts";
import { UserDoesNotExistError } from "../../../errors/user-does-not-exist-error.ts";
import type { reserveRepository } from "../../../repositories/reserve-repository.ts";
import type { userRepository } from "../../../repositories/user-repository.ts";
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
    private readonly userRepository: userRepository

    constructor(reserveRepository: reserveRepository, userRepository: userRepository) {
        this.reserveRepository = reserveRepository
        this.userRepository = userRepository
    }

    async execute(data: CreateReserveUseCaseRequest): Promise<CreateReserveUseCaseResponse> {
        const dateStartOfReserve = new Date(data.startOfReserve);
        const dateEndOfReserve = new Date(data.endOfReserve);

        if(isNaN(dateStartOfReserve.getTime()) || isNaN(dateEndOfReserve.getTime())) {
            throw new InvalidDateFormat()
        }

        const user = await this.userRepository.findById(data.idUser);
        if(!user) {
            throw new UserDoesNotExistError()
        }

        const dataReserve: Reserve = {
           idRoom: data.idRoom,
           idUser: data.idUser,
           status: 'PENDING',
           startOfReserve: dateStartOfReserve,
           endOfReserve: dateEndOfReserve
        }

        const reserve = await this.reserveRepository.create(dataReserve)
        return { reserve }
    }
}