import { PrismaUserRepository } from "../../../repositories/prisma/prisma-user-repository.ts";
import { CreateUserUseCase } from "../use-cases/create-user-use-case.ts";

export function MakeCreateUserUseCase() {
    const repository = new PrismaUserRepository()
    const useCase = new CreateUserUseCase(repository)

    return useCase
}