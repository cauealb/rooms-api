import { InMemoryUser } from "../../../repositories/in-memory/in-memory-user-repository.ts";
import { PrismaUserRepository } from "../../../repositories/prisma/prisma-user-repository.ts";
import { AutheticateUserUseCase } from "../use-cases/authenticate-user-use-case.ts";

export function MakeAuthenticateUserUseCase() {
    const repository = new PrismaUserRepository()
    const useCase = new AutheticateUserUseCase(repository)

    return useCase
}