import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { MakeCreateReserveUseCase } from "../../../module/reserve/factories/make-create-reserve-use-case.ts";

export async function createReserve(request: FastifyRequest, reply: FastifyReply) {
    const schemaCreateReserveQuery = z.object({
        idRoom: z.string(),
        idUser: z.string()
    })

    const schemaCreateReservesBody = z.object({
        startOfReserve: z.string(),
        endOfReserve: z.string(),
    })

    const { idRoom, idUser } = schemaCreateReserveQuery.parse(request.query)
    const { startOfReserve, endOfReserve } = schemaCreateReservesBody.parse(request.body)

    const data = {
        idRoom, 
        idUser,
        startOfReserve,
        endOfReserve
    }

    const useCase = MakeCreateReserveUseCase()
    const reserve = await useCase.execute(data)

    reply.status(204).send(reserve)
}