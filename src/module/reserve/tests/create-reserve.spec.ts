import { describe, it, expect, beforeEach } from 'vitest'
import type { reserveRepository } from '../../../repositories/reserve-repository.ts'
import { CreateReserveUseCase } from '../use-cases/create-reserve-use-case.ts'
import { InMemoryReserve } from '../../../repositories/in-memory/in-memory-reserve.ts'
import { InvalidDateFormat } from '../../../errors/invalid-date-format-error.ts'
import type { userRepository } from '../../../repositories/user-repository.ts'
import { InMemoryUser } from '../../../repositories/in-memory/in-memory-user.ts'
import { UserDoesNotExistError } from '../../../errors/user-does-not-exist-error.ts'
import type { roomRepository } from '../../../repositories/room-repository.ts'
import { InMemoryRoomsRepository } from '../../../repositories/in-memory/in-memory-rooms-repository.ts'
import { RoomDoesNotExistError } from '../../../errors/room-does-not-exist-error.ts'
import { IsAlreadyAReservationAvailableForThatDateError } from '../../../errors/is-already-a-reservation-available-for-that-date-error.ts'

let reserveRepository: reserveRepository
let userRepository: userRepository
let roomRepository: roomRepository
let sut: CreateReserveUseCase

describe("Create Reserve", () => {
    beforeEach(() => {
        reserveRepository = new InMemoryReserve()
        userRepository = new InMemoryUser()
        roomRepository = new InMemoryRoomsRepository()
        sut = new CreateReserveUseCase(reserveRepository, userRepository, roomRepository)
    })

    it("should be able create a reserve", async () => {
        userRepository.create({
            idUser: 'user-01',
            name: 'Cauê'
        })

        roomRepository.create({
            idRoom: 'room-01',
            nameRoom: 'room-a'
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
        roomRepository.create({
            idRoom: 'room-01',
            nameRoom: 'room-a'
        })

        await expect(async () => {
            await sut.execute({
                idRoom: 'room-01',
                idUser: 'invalid-user',
                startOfReserve: "2026-07-23T15:30:00-03:00",
                endOfReserve: "2026-07-23T16:30:00-03:00"
            })
        }).rejects.toBeInstanceOf(UserDoesNotExistError)
    })

    it("should be able validate invalid room", async () => {
        userRepository.create({
            idUser: 'user-01',
            name: 'Cauê'
        })

        await expect(async () => {
            await sut.execute({
                idRoom: 'invalid-room',
                idUser: 'user-01',
                startOfReserve: "2026-07-23T15:30:00-03:00",
                endOfReserve: "2026-07-23T16:30:00-03:00"
            })
        }).rejects.toBeInstanceOf(RoomDoesNotExistError)
    })

    it("should be able validate conflict of hours", async () => {
        userRepository.create({
            idUser: 'user-01',
            name: 'Cauê'
        })

        roomRepository.create({
            idRoom: 'room-01',
            nameRoom: 'room-a'
        })

        await sut.execute({
            idRoom: 'room-01',
            idUser: 'user-01',
            startOfReserve: "2026-07-23T15:30:00-03:00",
            endOfReserve: "2026-07-23T16:30:00-03:00"
        })

        await expect(async () => {
            await sut.execute({
                idRoom: 'room-01',
                idUser: 'user-01',
                startOfReserve: "2026-07-23T16:00:00-03:00",
                endOfReserve: "2026-07-23T17:30:00-03:00"
            })
        }).rejects.toBeInstanceOf(IsAlreadyAReservationAvailableForThatDateError)
    })

    it("should be able create reservations in differents hours", async () => {
        userRepository.create({
            idUser: 'user-01',
            name: 'Cauê'
        })

        roomRepository.create({
            idRoom: 'room-01',
            nameRoom: 'room-a'
        })

        await sut.execute({
            idRoom: 'room-01',
            idUser: 'user-01',
            startOfReserve: "2026-07-23T15:30:00-03:00",
            endOfReserve: "2026-07-23T16:30:00-03:00"
        })

        const { reserve } = await sut.execute({
            idRoom: 'room-01',
            idUser: 'user-01',
            startOfReserve: "2026-07-23T16:30:00-03:00",
            endOfReserve: "2026-07-23T17:30:00-03:00"
        })

        
        expect(reserve.idReserve).toEqual(expect.any(String))
    })
})