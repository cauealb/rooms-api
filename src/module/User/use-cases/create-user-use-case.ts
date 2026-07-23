import { InvalidInputForCreatingAUser } from "../../../errors/invalid-input-for-creating-a-user-error.ts";
import type { userRepository } from "../../../repositories/user-repository.ts";
import type { User } from "../../../types/user.ts";

export interface CreateUserUseCaseRequest {
    name: string
}

export interface CreateUserUseCaseResponse {
    user: User
}

export class CreateUserUseCase {
    private readonly userRepository: userRepository

    constructor(repository: userRepository) {
        this.userRepository = repository
    }

    async execute({ name }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
        if(name.length <= 1) {
            throw new InvalidInputForCreatingAUser()
        }

        const user = await this.userRepository.create({ name })

        return { user }
    }
}