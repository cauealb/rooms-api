import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'

interface CreateAndAuthenticateUserResponse {
    token: string
    refreshToken: string
    user: {
        idUser: string
        name: string
        email: string
    }
    password: string
}

export async function createAndAuthenticateUser(
    app: FastifyInstance,
): Promise<CreateAndAuthenticateUserResponse> {
    const password = 'admin123'

    const response = await app.inject({
        method: 'POST',
        url: '/user',
        payload: {
            name: 'Cauê',
            email: `user-${randomUUID()}@rooms-api.test`,
            password,
        },
    })

    if (response.statusCode !== 201) {
        throw new Error(
            `Não foi possível criar o usuário de teste: ${response.statusCode} ${response.body}`,
        )
    }

    const { user, token } = response.json()
    const refreshToken = response.cookies.find(
        (cookie) => cookie.name === 'refreshToken',
    )?.value

    if (!refreshToken) {
        throw new Error('A rota POST /user não devolveu o cookie refreshToken')
    }

    return { token, refreshToken, user, password }
}
