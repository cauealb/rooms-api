import { PrismaReserveRepository } from "../../../repositories/prisma/prisma-reserve-repository.ts";
import { FindReservesBetweenDates } from "../use-cases/find-reserves-between-dates.ts";

export function MakeFindReservesBetweenDatesUseCase() {
    const repository = new PrismaReserveRepository()
    const useCase = new FindReservesBetweenDates(repository)
}