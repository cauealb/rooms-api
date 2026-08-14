import { PrismaReserveRepository } from "../../../repositories/prisma/prisma-reserve-repository.ts";
import { FindPaginatedReserveUseCase } from "../use-cases/find-paginated-reserve-use-case.ts";

export function MakeFindPaginatedReserveUseCase() {
    const repository = new PrismaReserveRepository()
    const useCase = new FindPaginatedReserveUseCase(repository)

    return useCase
}