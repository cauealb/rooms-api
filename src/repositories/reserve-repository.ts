import type { Reserve } from "../types/reserve.ts";

export interface reserveRepository {
    create(data: Reserve): Promise<Reserve>
    
    findById(idReserve: string): Promise<Reserve | null>
    findReservesByStatus(status: string): Promise<Reserve[]>
    
    confirmReservation(idReserve: string): Promise<Reserve>
    cancelReservation(idReserve: string): Promise<Reserve>
    
    findAvailableReservationsOnDate(idRoom: string, startAt: string, endAt: string): Promise<Reserve[]>
    findPaginatedReservations(page: number): Promise<Reserve[]>
    findReservesBetweenDates(startAt: Date, endAt: Date): Promise<Reserve[]>
    
}