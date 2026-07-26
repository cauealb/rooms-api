import type { Room } from "../../types/rooms.ts";
import type { roomRepository } from "../room-repository.ts";

export class InMemoryRoomsRepository implements roomRepository {
    private item: Room[] = []

    async create(data: Room) {
        const room: Room = {
            idRoom: data.idRoom ?? 'room-01',
            nameRoom: data.nameRoom
        }
        
        this.item.push(room)
        return room
    }

    async findById(idRoom: string) {
        const room = this.item.find(item => item.idRoom === idRoom)

        if(!room) {
            return null
        }

        return room
    }
    
}