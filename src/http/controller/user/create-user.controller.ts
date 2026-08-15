import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { MakeCreateUserUseCase } from "../../../module/user/factories/make-create-user-use-case.ts";

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
    const schemaCreateUserBody = z.object({
        name: z.string()
    })

    const { name } = schemaCreateUserBody.parse(request.body)

    const useCase = MakeCreateUserUseCase()
    const user = await useCase.execute({ name })

    return reply.status(201).send(user)
}