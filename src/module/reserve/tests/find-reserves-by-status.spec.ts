import { beforeEach, describe, expect, it } from "vitest";
import type { reserveRepository } from "../../../repositories/reserve-repository.ts";
import { FindReservesByStatusUseCase } from "../use-cases/find-reserves-by-status-use-case.ts";
import { InMemoryReserve } from "../../../repositories/in-memory/in-memory-reserve-repository.ts";

let reserveRepository: reserveRepository
let sut: FindReservesByStatusUseCase

describe("Find reseves by status", () => {
    beforeEach(() => {
        reserveRepository = new InMemoryReserve()
        sut = new FindReservesByStatusUseCase(reserveRepository)
    })

    it("should be able find reseves by status", async () => {
        await reserveRepository.create({
            idRoom: `room-01`,
            idUser: `user-01`,
            status: 'PENDING',
            startOfReserve: new Date("2026-07-23T15:30:00-03:00"),
            endOfReserve: new Date("2026-07-23T16:30:00-03:00")
        })

        await reserveRepository.create({
            idRoom: `room-02`,
            idUser: `user-02`,
            status: 'PENDING',
            startOfReserve: new Date("2026-07-23T15:30:00-03:00"),
            endOfReserve: new Date("2026-07-23T16:30:00-03:00")
        })

        const { reserves } = await sut.execute({ status: 'PENDING' })

        expect(reserves).toHaveLength(2)
        expect(reserves).toEqual([
            expect.objectContaining({
                status: 'PENDING',
            }),
            expect.objectContaining({
                status: 'PENDING',
            }),
        ])
    })

    it("should be able find reserves by status with two reserves", async () => {
        await reserveRepository.create({
            idRoom: `room-02`,
            idUser: `user-02`,
            status: 'CONFIRMED',
            startOfReserve: new Date("2026-07-23T15:30:00-03:00"),
            endOfReserve: new Date("2026-07-23T16:30:00-03:00")
        })

        await reserveRepository.create({
            idRoom: `room-01`,
            idUser: `user-01`,
            status: 'PENDING',
            startOfReserve: new Date("2026-07-23T17:30:00-03:00"),
            endOfReserve: new Date("2026-07-23T19:00:00-03:00")
        })

        const { reserves } = await sut.execute({ status: 'CONFIRMED' })

        expect(reserves).toHaveLength(1)
        expect(reserves).toEqual([
            expect.objectContaining({
                status: 'CONFIRMED',
            })
        ])
    })

    it("should be able validate incorret status", async () => {

        await reserveRepository.create({
            idRoom: `room-01`,
            idUser: `user-01`,
            status: 'PENDING',
            startOfReserve: new Date("2026-07-23T17:30:00-03:00"),
            endOfReserve: new Date("2026-07-23T19:00:00-03:00")
        })
        
        await expect(async () => await sut.execute({ status: 'INCORRECT STATUS' })).rejects.toBeInstanceOf(Error)
    })
})