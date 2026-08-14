import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { MakeCancelReserveUseCase } from "../../../module/reserve/factories/make-cancel-reserve-use-case.ts";

export async function cancelReserve(request: FastifyRequest, reply: FastifyReply) {
    const schemaCancelReserveQuery = z.object({
        idReserve: z.string()
    })

    const { idReserve } = schemaCancelReserveQuery.parse(request.query)

    const useCase = MakeCancelReserveUseCase()
    const reserve = await useCase.execute({ idReserve })

    reply.status(200).send(reserve)
}