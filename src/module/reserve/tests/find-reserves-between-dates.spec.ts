import { beforeEach, describe, expect, it } from "vitest";
import type { reserveRepository } from "../../../repositories/reserve-repository.ts";
import { FindReservesBetweenDates } from "../use-cases/find-reserves-between-dates.ts";
import { InMemoryReserve } from "../../../repositories/in-memory/in-memory-reserve-repository.ts";
import { InvalidDateFormat } from "../../../errors/invalid-date-format-error.ts";

let reserveRepository: reserveRepository
let sut: FindReservesBetweenDates

describe("Find reserves between date", () => {
    beforeEach(() => {
        reserveRepository = new InMemoryReserve()
        sut = new FindReservesBetweenDates(reserveRepository)
    })

    it("should be able find reserves between dates", async () => {
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
            startOfReserve: new Date("2026-07-23T17:30:00-03:00"),
            endOfReserve: new Date("2026-07-23T19:00:00-03:00")
        })

        const { reserves } = await sut.execute({
            startAt: "2026-07-23T15:30:00-03:00",
            endAt: "2026-07-23T19:00:00-03:00"
        })

        expect(reserves).toHaveLength(2)
        expect(reserves).toEqual([
            expect.objectContaining({
                idRoom: `room-01`,
            }),
            expect.objectContaining({
                idRoom: `room-02`,
            }),
        ])
    })

    it("should be able validate dates", async () => {
        await expect(async () => {
            await sut.execute({
                startAt: "2026-07-23T20:30:00-03:00",
                endAt: "2026-07-23T19:00:00-03:00"
            })
        }).rejects.toBeInstanceOf(InvalidDateFormat)

        await expect(async () => {
            await sut.execute({
                startAt: "2026-07-23T15:99:00-03:00",
                endAt: "2026-07-23T19:00:00-03:00"
            })
        }).rejects.toBeInstanceOf(InvalidDateFormat)
    })
})