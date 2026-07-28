import { InvalidDateFormat } from "../../../errors/invalid-date-format-error.ts";
import { IsAlreadyAReservationAvailableForThatDateError } from "../../../errors/is-already-a-reservation-available-for-that-date-error.ts";
import { RoomDoesNotExistError } from "../../../errors/room-does-not-exist-error.ts";
import { UserDoesNotExistError } from "../../../errors/user-does-not-exist-error.ts";
import type { reserveRepository } from "../../../repositories/reserve-repository.ts";
import type { roomRepository } from "../../../repositories/room-repository.ts";
import type { userRepository } from "../../../repositories/user-repository.ts";
import type { Reserve } from "../../../types/reserve.ts";

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
    private readonly roomRepository: roomRepository

    constructor(reserveRepository: reserveRepository, userRepository: userRepository, roomRepository: roomRepository) {
        this.reserveRepository = reserveRepository
        this.userRepository = userRepository
        this.roomRepository = roomRepository
    }

    async execute(data: CreateReserveUseCaseRequest): Promise<CreateReserveUseCaseResponse> {
        const dateStartOfReserve = new Date(data.startOfReserve);
        const dateEndOfReserve = new Date(data.endOfReserve);

        if(isNaN(dateStartOfReserve.getTime()) || isNaN(dateEndOfReserve.getTime())) {
            throw new InvalidDateFormat()
        }

        const room = await this.roomRepository.findById(data.idRoom);
        if(!room) {
            throw new RoomDoesNotExistError()
        }

        const user = await this.userRepository.findById(data.idUser);
        if(!user) {
            throw new UserDoesNotExistError()
        }

        const reserves = await this.reserveRepository.findAvailableReservationsOnDate(data.idRoom, data.startOfReserve, data.endOfReserve)
        if(reserves.length > 0) {
            throw new IsAlreadyAReservationAvailableForThatDateError()
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