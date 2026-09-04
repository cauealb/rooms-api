import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { MakeAuthenticateUserUseCase } from "../../../module/user/factories/make-authenticate-user-use-case.ts";

export async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {
    const schemaAuthenticateUser = z.object({
        email: z.email(),
        password: z.string()
    })

    const { email, password } = schemaAuthenticateUser.parse(request.body)
    const useCase = MakeAuthenticateUserUseCase()

    const { user } = await useCase.execute({email, password})

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
                expiresIn: '10m'
            }
        }
    )

    reply.setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true
    })

    return reply.status(200).send(user)
}