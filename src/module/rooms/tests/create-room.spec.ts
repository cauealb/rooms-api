import { describe, it, expect, beforeEach } from 'vitest'
import type { roomRepository } from '../../../repositories/room-repository.ts'
import { CreateRoomUseCase } from '../use-cases/create-room-use-case.ts'
import { InMemoryRoomsRepository } from '../../../repositories/in-memory/in-memory-rooms-repository.ts'

let repository: roomRepository
let sut: CreateRoomUseCase

describe("Create room", () => {

    beforeEach(() => {
        repository = new InMemoryRoomsRepository()
        sut = new CreateRoomUseCase(repository)
    })

    it("should be able create a room", async () => {
        const { room } = await sut.execute({
            nameRoom: 'room-01'
        })

        console.log(room)

        expect(room.idRoom).toEqual(expect.any(String))
    })
})