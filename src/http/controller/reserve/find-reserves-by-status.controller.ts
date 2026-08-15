import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { MakeFindReservesByStatusUseCase } from "../../../module/reserve/factories/make-find-reserves-by-status-use-case.ts";

export async function findReservesByStatus(request: FastifyRequest, reply: FastifyReply) {
    const shemaFindReservesByStatus = z.object({
        status: z.enum(['PENDING', 'CONFIRMED', 'CANCELED'])
    })

    const { status } = shemaFindReservesByStatus.parse(request.query)
    
    const useCase = MakeFindReservesByStatusUseCase()
    const reserves = await useCase.execute({ status })

    return reply.status(200).send(reserves)
}