import { PrismaReserveRepository } from "../../../repositories/prisma/prisma-reserve-repository.ts";
import { ConfirmReserveUseCase } from "../use-cases/confirm-reserve-use-case.ts";

export function MakeConfirmReserveUseCase() {
    const repository = new PrismaReserveRepository()
    const useCase = new ConfirmReserveUseCase(repository)

    return useCase
}