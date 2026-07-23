import type { ReserveCreate, Reserve } from "../../types/reserve.ts";
import type { reserveRepository } from "../reserve-repository.ts";

export class InMemoryReserve implements reserveRepository {
    private item: Reserve[] = []

    async create(data: ReserveCreate): Promise<Reserve> {
        const reserve: Reserve = {
            idReserve: 'resever-01',
            idRoom: data.idRoom,
            idUser: data.idUser,
            idStatus: 'status-01',
            startOfReserve: data.startOfReserve,
            endOfReserve: data.endOfReserve,
        }

        this.item.push(reserve)
        return reserve
    }
}