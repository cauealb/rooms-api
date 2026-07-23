import type { Reserve, ReserveCreate } from "../types/reserve.ts";

export interface reserveRepository {
    create(data: ReserveCreate): Promise<Reserve>
    findById(idReserve: string): Promise<Reserve | null>
    cancelReservation(idReserve: string): Promise<Reserve>
}