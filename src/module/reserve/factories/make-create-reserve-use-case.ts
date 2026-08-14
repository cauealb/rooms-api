import { PrismaReserveRepository } from "../../../repositories/prisma/prisma-reserve-repository.ts";
import { PrismaRoomRepository } from "../../../repositories/prisma/prisma-room-repository.ts";
import { PrismaUserRepository } from "../../../repositories/prisma/prisma-user-repository.ts";
import { CreateRoomUseCase } from "../../rooms/use-cases/create-room-use-case.ts";
import { CreateReserveUseCase } from "../use-cases/create-reserve-use-case.ts";

export function MakeCreateReserveUseCase() {
    const reserveRepository = new PrismaReserveRepository()
    const userRepository = new PrismaUserRepository()
    const roomRepository = new PrismaRoomRepository()
    const useCase = new CreateReserveUseCase(reserveRepository, userRepository, roomRepository)

    return useCase
}