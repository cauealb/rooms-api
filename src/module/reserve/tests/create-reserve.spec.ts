import { describe, it, expect, beforeEach } from 'vitest'
import type { reserveRepository } from '../../../repositories/reserve-repository.ts'
import { CreateReserveUseCase } from '../use-cases/create-reserve-use-case.ts'
import { InMemoryReserve } from '../../../repositories/in-memory/in-memory-reserve.ts'

let repository: reserveRepository
let sut: CreateReserveUseCase

describe("Create Reserve", () => {
    beforeEach(() => {
        repository = new InMemoryReserve()
        sut = new CreateReserveUseCase(repository)
    })

    it("should be able create a reserve", async () => {
        const { reserve } = await sut.execute({
            idRoom: 'room-01',
            idUser: 'user-01',
            startOfReserve: "2026-07-23T15:30:00-03:00",
            endOfReserve: "2026-07-23T16:30:00-03:00"
        })

        expect(reserve.idReserve).toEqual(expect.any(String))
    })

    // it("should be able validate dates in the UTC format", async () => {
    //     expect(async () => {
    //         await sut.execute({
    //             idRoom: 'room-01',
    //             idUser: 'user-01',
    //             startOfReserve: "2026-07-23T15:30:00",
    //             endOfReserve: "2026-07-23T16:30:00"
    //         })
    //     }).rejects.toBeInstanceOf(Error)
    // })
})