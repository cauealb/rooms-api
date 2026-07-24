import { describe, it, expect, beforeEach } from 'vitest'
import type { reserveRepository } from '../../../repositories/reserve-repository.ts'
import { ConfirmReserveUseCase } from '../use-cases/confirm-reserve-use-case.ts'
import { InMemoryReserve } from '../../../repositories/in-memory/in-memory-reserve.ts'
import { ReserveDoesNotExistError } from '../../../errors/reserve-does-not-exist-error.ts'

let repository: reserveRepository
let sut: ConfirmReserveUseCase

describe("Confirm reserve", () => {

    beforeEach(() => {
        repository = new InMemoryReserve()
        sut = new ConfirmReserveUseCase(repository)
    })

    it("should be able to confirm reserve", async () => {
        const createdReservation = await repository.create({
            idRoom: 'room-01',
            idUser: 'user-01',
            status: 'PENDING',
            startOfReserve: new Date("2026-07-23T15:30:00-03:00"),
            endOfReserve: new Date("2026-07-23T16:30:00-03:00")
        })

        const { reserve } = await sut.execute({
            idRoom: 'room-01',
            idUser: 'user-01',
            idReserve: createdReservation.idReserve!
        })

        expect(reserve).toEqual(expect.objectContaining({
            status: 'CONFIRMED'
        }))
        expect(reserve.status).toEqual(expect.any(String))
    })

    it("should be able validate a reservation that does not exist",async () => {
        await expect(async() => {
            await sut.execute({
                idRoom: 'room-01',
                idUser: 'user-01',
                idReserve: 'invalid-reservation'
            })
        }).rejects.toBeInstanceOf(ReserveDoesNotExistError)
    })

    it("should be able validate a reservation that has already been confirmed",async () => {
        const createdReservation = await repository.create({
            idRoom: 'room-01',
            idUser: 'user-01',
            status: 'PENDING',
            startOfReserve: new Date("2026-07-23T15:30:00-03:00"),
            endOfReserve: new Date("2026-07-23T16:30:00-03:00")
        })

        await sut.execute({
            idRoom: 'room-01',
            idUser: 'user-01',
            idReserve: createdReservation.idReserve!
        })

        await expect(async() => {
            await sut.execute({
                idRoom: 'room-01',
                idUser: 'user-01',
                idReserve: createdReservation.idReserve!
            })
        }).rejects.toBeInstanceOf(Error)
    })
})