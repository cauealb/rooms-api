import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { MakeCreateUserUseCase } from "../../../module/user/factories/make-create-user-use-case.ts";

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
    const schemaCreateUserBody = z.object({
        name: z.string(),
        email: z.email(),
        password: z.string()
    })

    const { name, email, password } = schemaCreateUserBody.parse(request.body)

    const useCase = MakeCreateUserUseCase()
    const { user } = await useCase.execute({ name, email, password })

    const token = await reply.jwtSign(
        {},
        {
            sign: {
                sub: user.idUser,
                expiresIn: '10m'
            }
        }
    )

    const refreshToken = await reply.jwtSign(
        {},
        {
            sign: {
                sub: user.idUser,
                expiresIn: '7d'
            }
        }
    )

    reply.setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: true
    })
    return reply.status(201).send({user, token})
}