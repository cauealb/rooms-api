import type { Reserve, ReserveCreate } from "../types/reserve.ts";

export interface reserveRepository {
    create(data: Reserve): Promise<Reserve>
    findById(idReserve: string): Promise<Reserve | null>
    confirmReservation(idReserve: string): Promise<Reserve>
    cancelReservation(idReserve: string): Promise<Reserve>
}