import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { MakeFindPaginatedReserveUseCase } from "../../../module/reserve/factories/make-find-paginated-reserve-use-case.ts";

export async function findPaginatedReserve(request: FastifyRequest, reply: FastifyReply) {
    const schemaFindPaginatedReserveQuery = z.object({
        page: z.coerce.number().min(1).default(1)
    })

    const { page } = schemaFindPaginatedReserveQuery.parse(request.body)

    const useCase = MakeFindPaginatedReserveUseCase()
    const reserves = await useCase.execute({ page })

    return reply.status(200).send(reserves)
}