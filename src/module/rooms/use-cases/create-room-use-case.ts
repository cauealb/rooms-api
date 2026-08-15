import { InvalidNameRoomForCreatioError } from "../../../errors/invalid-name-room-for-creation-error.ts";
import type { roomRepository } from "../../../repositories/room-repository.ts";
import type { Room } from "../../../types/Rooms.ts";

export interface CreateRoomUseCaseRequest {
    nameRoom: string
}

export interface CreateRoomUseCaseResponse {
    room: Room
}

export class CreateRoomUseCase {
    private readonly roomRepository: roomRepository

    constructor(repository: roomRepository) {
        this.roomRepository = repository
    }

    async execute({ nameRoom }: CreateRoomUseCaseRequest): Promise<CreateRoomUseCaseResponse> {
        if(nameRoom.length === 0) {
            throw new InvalidNameRoomForCreatioError()
        }

        const room = await this.roomRepository.create({ nameRoom })

        return { room }
    }
}