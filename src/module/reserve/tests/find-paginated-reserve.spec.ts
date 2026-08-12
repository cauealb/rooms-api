import { beforeEach, describe, expect, it } from "vitest";
import type { reserveRepository } from "../../../repositories/reserve-repository.ts";
import { FindPaginatedReserveUseCase } from "../use-cases/find-paginated-reserve-use-case.ts";
import { InMemoryReserve } from "../../../repositories/in-memory/in-memory-reserve-repository.ts";

let reserveRepository: reserveRepository
let sut: FindPaginatedReserveUseCase

describe("Find paginated reserve", () => {
    beforeEach(() => {
        reserveRepository = new InMemoryReserve()
        sut = new FindPaginatedReserveUseCase(reserveRepository)
    })

    it("should be able find paginated reserve", async () => {
        for(let i  = 1; i <= 22; i++) {
            await reserveRepository.create({
                idRoom: `room-0${i}`,
                idUser: `user-01`,
                status: 'PENDING',
                startOfReserve: new Date("2026-07-23T15:30:00-03:00"),
                endOfReserve: new Date("2026-07-23T16:30:00-03:00")
            })
        }

        const { reserves } = await sut.execute({ page: 2 });

        expect(reserves).toHaveLength(2)
        expect(reserves).toEqual([
            expect.objectContaining({
                idRoom: 'room-021'
            }),
            expect.objectContaining({
                idRoom: 'room-022'
            })
        ])
    })
})