import type { ReserveCreate, Reserve } from "../../types/reserve.ts";
import type { reserveRepository } from "../reserve-repository.ts";

export class InMemoryReserve implements reserveRepository {
    private item: Reserve[] = []

    async create(data: Reserve): Promise<Reserve> {
        const reserve: Reserve = {
            idReserve: data.idReserve ?? 'reserve-01',
            idRoom: data.idRoom,
            idUser: data.idUser,
            status: 'PENDING',
            startOfReserve: data.startOfReserve,
            endOfReserve: data.endOfReserve,
        }

        this.item.push(reserve)
        return reserve
    }

    async findById(idReserve: string): Promise<Reserve | null> {
        const reserve = this.item.find(item => item.idReserve = idReserve)

        if(!reserve) {
            return null
        }

        return reserve
    }

    async cancelReservation(idReserve: string): Promise<Reserve> {
        const reserve = this.item.find(item => item.idReserve = idReserve)

        reserve!.status = "CANCELED"
        return reserve!
    }
}