import dayjs from "dayjs";
import type { Reserve } from "../../types/reserve.ts";
import type { reserveRepository } from "../reserve-repository.ts";

export class InMemoryReserve implements reserveRepository {
    private item: Reserve[] = []

    async create(data: Reserve): Promise<Reserve> {
        const reserve: Reserve = {
            idReserve: data.idReserve ?? 'reserve-01',
            idRoom: data.idRoom,
            idUser: data.idUser,
            status: data.status ?? 'PENDING',
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

    async confirmReservation(idReserve: string) {
        const reserve = this.item.find(item => item.idReserve = idReserve)
        reserve!.status = "CONFIRMED"

        return reserve!
    }

    async cancelReservation(idReserve: string): Promise<Reserve> {
        const reserve = this.item.find(item => item.idReserve = idReserve)
        reserve!.status = "CANCELED"

        return reserve!
    }

    async findAvailableReservationsOnDate(idRoom: string, startAt: string, endAt: string): Promise<Reserve[]> {
        const dateStartOf = dayjs(startAt)
        const dateEndOf = dayjs(endAt)

        const reserves = this.item.filter(item => {
            if(item.idRoom === idRoom) {
                if(item.status !== 'CANCELED') {
                    return (dateStartOf.isBefore(item.endOfReserve) && dateEndOf.isAfter(item.startOfReserve)) 
                }
            }
        })

        return reserves
    }

    async findPaginatedReservations(page: number) {
        return this.item.slice((page - 1) * 20, page * 20)
    }

    async findReservesByStatus(status: string): Promise<Reserve[]> {
        return this.item.filter(item => item.status === status)
    }

    async findReservesBetweenDates(startAt: Date, endAt: Date): Promise<Reserve[]> {
        const dateStartAt = dayjs(startAt)
        const dateEndAt = dayjs(endAt)

        return this.item.filter(item => dateStartAt.isAfter(item.startOfReserve) && dateEndAt.isBefore(item.endOfReserve))
    }
}