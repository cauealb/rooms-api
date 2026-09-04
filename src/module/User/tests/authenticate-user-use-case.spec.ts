import { beforeEach, describe, expect, it } from "vitest";
import type { userRepository } from "../../../repositories/user-repository.ts";
import { AutheticateUserUseCase } from "../use-cases/authenticate-user-use-case.ts";
import { InMemoryUser } from "../../../repositories/in-memory/in-memory-user-repository.ts";
import { hash } from "bcrypt";
import { env } from "../../../env/index.ts";

let repository: userRepository
let sut: AutheticateUserUseCase

describe("Authenticate user (unit)", () => {
    beforeEach(async () => {
        repository = new InMemoryUser()
        sut = new AutheticateUserUseCase(repository)

        await repository.create({
            name: 'Cauê',
            email: 'cauealvesdev@gmail.com',
            password: await hash('admin123', env.SALT)
        })
    })

    it("should be able authenticate user", async () => {
        const { user} = await sut.execute({
            email: 'cauealvesdev@gmail.com',
            password: 'admin123'
        })

        console.log(user)
        expect(user.idUser).toEqual(expect.any(String))
    })

    it("should be able not authenticate user", async () => {
        await expect(async () => {
            await sut.execute({
                email: 'cauealvesdev1@gmail.com',
                password: 'admin123'
            })
        }).rejects.toBeInstanceOf(Error)

        await expect(async () => {
            await sut.execute({
                email: 'cauealvesdev@gmail.com',
                password: 'admin1234'
            })
        }).rejects.toBeInstanceOf(Error)
    })
})