import dayjs from "dayjs";
import { ReserveStatus } from "../../generated/prisma/enums.ts";
import { prisma } from "../../lib/prisma.ts";
import type { Reserve } from "../../types/reserve.ts";
import type { reserveRepository } from "../reserve-repository.ts";
import { asyncWrapProviders } from "node:async_hooks";

export class PrismaReserveRepository implements reserveRepository {
    async create(data: Reserve) {
        return await prisma.reserve.create({
            data: {
                idRoom: data.idRoom,
                idUser: data.idUser,
                startOfReserve: data.startOfReserve,
                endOfReserve: data.endOfReserve
            }
        })
    }

    async findById(idReserve: string) {
        const reserve = await prisma.reserve.findUnique({ where: { idReserve: idReserve } })

        if(!reserve) return null
        
        return reserve
    }

    async findReservesByStatus(status: string) {
        return await prisma.reserve.findMany({
            where: {
                status: status as ReserveStatus
            }
        })
    }

    async confirmReservation(idReserve: string) {
        const reserve = await prisma.reserve.findUnique({ where: { idReserve: idReserve } })
         // TODO: Validar reserve da forma correta, se não achar, enviar algo para dizer que não existe esta reserva

        return await prisma.reserve.update({
            where: { 
                idReserve: reserve?.idReserve!
            },
            data: {
                status: 'CONFIRMED'
            }
        })
    }

    async cancelReservation(idReserve: string): Promise<Reserve> {
        const reserve = await prisma.reserve.findUnique({ where: { idReserve: idReserve } })
        // TODO: Validar reserve da forma correta, se não achar, enviar algo para dizer que não existe esta reserva

        return await prisma.reserve.update({
            where: {
                idReserve: reserve?.idReserve!
            },
            data: {
                status: 'CANCELED'
            }
        })
    }

    async findAvailableReservationsOnDate(idRoom: string, startAt: string, endAt: string): Promise<Reserve[]> {
        return await prisma.reserve.findMany({
            where: {
               idRoom: idRoom,
               status: {
                not: "CANCELED"
               },
               startOfReserve: {
                lte: startAt
               },
               endOfReserve: {
                lte: endAt
               }
            }
        })
    }

    async findPaginatedReservations(page: number): Promise<Reserve[]> {
        return await prisma.reserve.findMany({
            skip: page * 20,
            take: 20
        })
    }

    async findReservesBetweenDates(startAt: Date, endAt: Date): Promise<Reserve[]> {
        return await prisma.reserve.findMany({
            where: {
                startOfReserve: {
                    lte: startAt
                },
                endOfReserve: {
                    lte: endAt
                }
            }
        })
    }

}