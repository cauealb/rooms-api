import { describe, it, expect, beforeEach } from 'vitest'
import type { userRepository } from '../../../repositories/user-repository.ts'
import { CreateUserUseCase } from '../useCases/create-user-use-case.ts'
import { InMemoryUser } from '../../../repositories/in-memory/in-memory-user.ts'
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
            name: 'Cauê'
        })

        expect(user.idUser).toEqual(expect.any(String))
    })

    it("should be able validate short names", async () => {
        await expect(async () => {
            await sut.execute({
                name: 'C'
            })
        }).rejects.toBeInstanceOf(InvalidInputForCreatingAUser)

        await expect(async () => {
            await sut.execute({
                name: ''
            })
        }).rejects.toBeInstanceOf(InvalidInputForCreatingAUser)
    })
})