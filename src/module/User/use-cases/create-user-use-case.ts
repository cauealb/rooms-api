import { env } from "../../../env/index.ts";
import { InvalidInputForCreatingAUser } from "../../../errors/invalid-input-for-creating-a-user-error.ts";
import type { userRepository } from "../../../repositories/user-repository.ts";
import type { User } from "../../../types/User.ts";
import { hash } from 'bcrypt'

export interface CreateUserUseCaseRequest {
    name: string
    email: string
    password: string
}

export interface CreateUserUseCaseResponse {
    user: User
}

export class CreateUserUseCase {
    private readonly userRepository: userRepository

    constructor(repository: userRepository) {
        this.userRepository = repository
    }

    async execute({ name, email, password }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
        if(name.length <= 1) {
            throw new InvalidInputForCreatingAUser()
        }

        const password_hash = await hash(password, env.SALT)
        const user = await this.userRepository.create({ name, email, password: password_hash })

        return { user }
    }
}