import type { roomRepository } from "../../../repositories/room-repository.ts";
import type { Room } from "../../../types/rooms.ts";

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
        const room = await this.roomRepository.create({ nameRoom })

        return { room }
    }
}