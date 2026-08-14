import { PrismaRoomRepository } from "../../../repositories/prisma/prisma-room-repository.ts";
import { CreateRoomUseCase } from "../use-cases/create-room-use-case.ts";

export function MakeCreateRoomUseCase() {
    const repository = new PrismaRoomRepository()
    const useCase = new CreateRoomUseCase(repository)

    return useCase
}