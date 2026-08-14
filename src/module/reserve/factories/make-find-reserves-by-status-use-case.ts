import { PrismaReserveRepository } from "../../../repositories/prisma/prisma-reserve-repository.ts";
import { FindReservesByStatusUseCase } from "../use-cases/find-reserves-by-status-use-case.ts";

export function MakeFindReservesByStatusUseCase() {
    const repository = new PrismaReserveRepository()
    const useCase = new FindReservesByStatusUseCase(repository)

    return useCase
}