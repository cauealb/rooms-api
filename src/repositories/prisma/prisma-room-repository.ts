import { prisma } from "../../lib/prisma.ts";
import type { Room } from "../../types/Rooms.ts";
import type { roomRepository } from "../room-repository.ts";

export class PrismaRoomRepository implements roomRepository {
    async create(data: Room) {
        return await prisma.room.create({
            data: data
        })
    }

    async findById(idRoom: string) {
        const room = await prisma.room.findUnique({ where: { idRoom: idRoom } })

        if(!room) return null

        return room
    }
}