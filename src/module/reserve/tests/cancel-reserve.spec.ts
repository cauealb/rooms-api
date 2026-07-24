import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryReserve } from '../../../repositories/in-memory/in-memory-reserve.ts'
import type { reserveRepository } from '../../../repositories/reserve-repository.ts'
import { CancelReserveUseCase } from '../use-cases/cancel-reserve-use-case.ts'
import { ReserveDoesNotExistError } from '../../../errors/reserve-does-not-exist-error.ts'
import { ReservationHasAlreadyBeenCancelledError } from '../../../errors/reservation-has-already-been-cancelled-error..ts'

let repository: reserveRepository
let sut: CancelReserveUseCase

describe("Cancel Reserve", () => {
    beforeEach(() => {
        repository = new InMemoryReserve()
        sut = new CancelReserveUseCase(repository)
    })

    it("should be able cancel a reserve", async () => {
        await repository.create({
            idReserve: 'reserve-01',
            idRoom: 'room-01',
            idUser: 'user-01',
            status: 'PENDING',
            startOfReserve: new Date("2026-07-23T15:30:00-03:00"),
            endOfReserve: new Date("2026-07-23T16:30:00-03:00")
        })

        const { reserve } = await sut.execute({
            idReserve: 'reserve-01'
        })

        expect(reserve).toEqual(expect.objectContaining({
            status: 'CANCELED'
        }))
    })

    it("should be able validade a non-existent reservation", async () => {
        await expect(async () => {
            await sut.execute({
                idReserve: 'reserve-01'
            })
        }).rejects.toBeInstanceOf(ReserveDoesNotExistError)
    })

    it("should be able validate whether the reservation has already been cancelled", async () => {
        await repository.create({
            idReserve: 'reserve-01',
            idRoom: 'room-01',
            idUser: 'user-01',
            status: 'PENDING',
            startOfReserve: new Date("2026-07-23T15:30:00-03:00"),
            endOfReserve: new Date("2026-07-23T16:30:00-03:00")
        })

        const { reserve } = await sut.execute({
            idReserve: 'reserve-01'
        })

        await expect(async () => {
            await sut.execute({
                idReserve: 'reserve-01'
            })
        }).rejects.toBeInstanceOf(ReservationHasAlreadyBeenCancelledError)
    })
})