import { ReserveStatus } from "../../generated/prisma/enums.ts";
import { prisma } from "../../lib/prisma.ts";
import type { Reserve } from "../../types/reserve.ts";
import type { reserveRepository } from "../reserve-repository.ts";

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

    async cancelReservation(idReserve: string) {
        const reserve = await prisma.reserve.findUnique({ where: { idReserve: idReserve } })

        return await prisma.reserve.update({
            where: {
                idReserve: reserve?.idReserve!
            },
            data: {
                status: 'CANCELED'
            }
        })
    }

    async findAvailableReservationsOnDate(idRoom: string, startAt: string, endAt: string) {
        return await prisma.reserve.findMany({
            where: {
               idRoom: idRoom,
               status: {
                not: "CANCELED"
               },
               // Há conflito quando os intervalos se sobrepõem.
               startOfReserve: {
                lt: endAt
               },
               endOfReserve: {
                gt: startAt
               }
            }
        })
    }

    async findPaginatedReservations(page: number) {
        return await prisma.reserve.findMany({
            orderBy: { startOfReserve: "asc" },
            skip: (page - 1) * 20,
            take: 20
        })
    }

    async findReservesBetweenDates(startAt: Date, endAt: Date) {
        return await prisma.reserve.findMany({
            where: {
                status: {
                    not: "CANCELED"
                },
                startOfReserve: {
                    lt: endAt
                },
                endOfReserve: {
                    gt: startAt
                }
            }
        })
    }

}