import { describe, it, expect, beforeEach } from 'vitest'
import type { userRepository } from '../../../repositories/user-repository.ts'
import { CreateUserUseCase } from '../use-cases/create-user-use-case.ts'
import { InMemoryUser } from '../../../repositories/in-memory/in-memory-user-repository.ts'
import { InvalidInputForCreatingAUser } from '../../../errors/invalid-input-for-creating-a-user-error.ts'

let repository: userRepository
let sut: CreateUserUseCase

describe("Create user use case", () => {
    beforeEach(() => {
        repository = new InMemoryUser()
        sut = new CreateUserUseCase(repository)
    })

    it("should be able create a user", async () => {
        const { user } = await sut.execute({
            name: 'Cauê',
            email: 'cauealvesdev@gmail.com',
            password: 'admin123'
        })

        expect(user.idUser).toEqual(expect.any(String))
    })

    it("should be able validate short names", async () => {
        await expect(async () => {
            await sut.execute({
                name: 'C',
                email: 'cauealvesdev@gmail.com',
                password: 'admin123'
            })
        }).rejects.toBeInstanceOf(InvalidInputForCreatingAUser)

        await expect(async () => {
            await sut.execute({
                name: '',
                email: 'cauealvesdev@gmail.com',
                password: 'admin123'
            })
        }).rejects.toBeInstanceOf(InvalidInputForCreatingAUser)
    })
})