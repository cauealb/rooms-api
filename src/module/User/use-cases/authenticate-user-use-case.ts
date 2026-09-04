import type { User } from "../../../generated/prisma/client.ts";
import type { userRepository } from "../../../repositories/user-repository.ts";
import { compare } from 'bcrypt'

interface AutheticateUserUseCaseRequest {
    email: string
    password: string
}

interface AutheticateUserUseCaseResponse {
    user: User
}

export class AutheticateUserUseCase {
    private readonly userRepository: userRepository

    constructor(repository: userRepository) {
        this.userRepository = repository
    }

    async execute({ email, password }: AutheticateUserUseCaseRequest): Promise<AutheticateUserUseCaseResponse> {
        const user = await this.userRepository.findByEmail(email)
        if(!user) {
            throw new Error()
        }
        
        const isPasswordMatches = await compare(password, user.password)
        if(!isPasswordMatches) {
            throw new Error()
        }

        return { user }
    }
}