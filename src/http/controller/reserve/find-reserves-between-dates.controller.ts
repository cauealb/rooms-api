import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { MakeFindReservesBetweenDatesUseCase } from "../../../module/reserve/factories/make-find-reserves-between-dates-use-case.ts";

export async function findReservesBetweenDates(request: FastifyRequest, reply: FastifyReply) {
    const schemaFindReservesBetweenDatesBody = z.object({
        startAt: z.string(),
        endAt: z.string()
    })

    const { startAt, endAt } = schemaFindReservesBetweenDatesBody.parse(request.body)
    
    const useCase = MakeFindReservesBetweenDatesUseCase()
    const reserves = await useCase.execute({ startAt, endAt })

    return reply.status(200).send(reserves)
}