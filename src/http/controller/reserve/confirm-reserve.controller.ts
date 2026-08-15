import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { MakeConfirmReserveUseCase } from "../../../module/reserve/factories/make-confirm-reserve-use-case.ts";

export async function confirmReserve(request: FastifyRequest, reply: FastifyReply) {
    const schemaConfirmReserveQuery = z.object({
        idReserve: z.string()
    })

    const { idReserve } = schemaConfirmReserveQuery.parse(request.body)

    const useCase = MakeConfirmReserveUseCase()
    const reserve = await useCase.execute({ idReserve })

    return reply.status(200).send(reserve)
}