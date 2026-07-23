import { describe, it, expect, beforeEach } from 'vitest'
import type { reserveRepository } from '../../../repositories/reserve-repository.ts'
import { CreateReserveUseCase } from '../use-cases/create-reserve-use-case.ts'
import { InMemoryReserve } from '../../../repositories/in-memory/in-memory-reserve.ts'
import { InvalidDateFormat } from '../../../errors/invalid-date-format-error.ts'
import type { userRepository } from '../../../repositories/user-repository.ts'
import { InMemoryUser } from '../../../repositories/in-memory/in-memory-user.ts'
import { UserDoesNotExistError } from '../../../errors/user-does-not-exist-error.ts'

let reserveRepository: reserveRepository
let userRepository: userRepository
let sut: CreateReserveUseCase

describe("Create Reserve", () => {
    beforeEach(() => {
        reserveRepository = new InMemoryReserve()
        userRepository = new InMemoryUser()
        sut = new CreateReserveUseCase(reserveRepository, userRepository)
    })

    it("should be able create a reserve", async () => {
        userRepository.create({
            idUser: 'user-01',
            name: 'Cauê'
        })

        const { reserve } = await sut.execute({
            idRoom: 'room-01',
            idUser: 'user-01',
            startOfReserve: "2026-07-23T15:30:00-03:00",
            endOfReserve: "2026-07-23T16:30:00-03:00"
        })

        expect(reserve.idReserve).toEqual(expect.any(String))
    })

    it("should be able validate dates in the UTC format", async () => {
        userRepository.create({
            idUser: 'user-01',
            name: 'Cauê'
        })

        await expect(async () => {
            await sut.execute({
                idRoom: 'room-01',
                idUser: 'user-01',
                startOfReserve: "2026-30-23T15:30:00",
                endOfReserve: "2026-07-23T16:30:00"
            })
        }).rejects.toBeInstanceOf(InvalidDateFormat)
    })

    it("should be able validate invalid user", async () => {
        await expect(async () => {
            await sut.execute({
                idRoom: 'room-01',
                idUser: 'user-01',
                startOfReserve: "2026-07-23T15:30:00",
                endOfReserve: "2026-07-23T16:30:00"
            })
        }).rejects.toBeInstanceOf(UserDoesNotExistError)
    })

    it.todo("should be able validate invalid room")
})