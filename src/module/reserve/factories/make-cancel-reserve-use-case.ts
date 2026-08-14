import { PrismaReserveRepository } from "../../../repositories/prisma/prisma-reserve-repository.ts";
import { CancelReserveUseCase } from "../use-cases/cancel-reserve-use-case.ts";

export function MakeCancelReserveUseCase() {
    const repository = new PrismaReserveRepository()
    const useCase = new CancelReserveUseCase(repository)

    return useCase
}