import type { FastifyInstance } from 'fastify'

interface CreateReserveParams {
    token: string
    idRoom: string
    idUser: string
    startOfReserve: string
    endOfReserve: string
}

interface CreateReserveResponse {
    idReserve: string
    idRoom: string
    idUser: string
    status: 'PENDING' | 'CONFIRMED' | 'CANCELED'
    startOfReserve: string
    endOfReserve: string
}

export async function createReserve(
    app: FastifyInstance,
    { token, idRoom, idUser, startOfReserve, endOfReserve }: CreateReserveParams,
): Promise<CreateReserveResponse> {
    const response = await app.inject({
        method: 'POST',
        url: '/reserve',
        headers: { authorization: `Bearer ${token}` },
        query: { idRoom, idUser },
        payload: { startOfReserve, endOfReserve },
    })

    if (response.statusCode !== 201) {
        throw new Error(
            `Não foi possível criar a reserva de teste: ${response.statusCode} ${response.body}`,
        )
    }

    return response.json().reserve
}
