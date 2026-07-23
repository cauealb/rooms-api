import type { Reserve, ReserveCreate } from "../types/reserve.ts";

export interface reserveRepository {
    create(data: ReserveCreate): Promise<Reserve>
}