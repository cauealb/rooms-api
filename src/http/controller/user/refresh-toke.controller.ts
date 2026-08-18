import type { FastifyReply, FastifyRequest } from "fastify";

export async function refreshToken(request: FastifyRequest, reply: FastifyReply) {
    const token = await reply.jwtSign(
        {},
        {
            sign: {
                sub: request.user.sub,
                expiresIn: '10m'
            }
        }
    )

    const refreshToken = await reply.jwtSign(
        {},

        {
            sign: {
                sub: request.user.sub,
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
}