import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { MakeCreateRoomUseCase } from "../../../module/rooms/factories/make-create-room-use-case.ts";

export async function createRoom(request: FastifyRequest, reply: FastifyReply) {
    const schemaCreateRoomBody = z.object({
        nameRoom: z.string()
    })

    const { nameRoom } = schemaCreateRoomBody.parse(request.body)

    const useCase = MakeCreateRoomUseCase()
    const room = await useCase.execute({ nameRoom })

    return reply.status(201).send(room)
}