import type { Room } from "../types/rooms.ts";

export interface roomRepository {
    create(data: Room): Promise<Room>
    findById(idRoom: string): Promise<Room | null>
}