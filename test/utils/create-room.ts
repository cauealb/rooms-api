import type { FastifyInstance } from 'fastify'

interface CreateRoomResponse {
    idRoom: string
    nameRoom: string
}

export async function createRoom(
    app: FastifyInstance,
    token: string,
    nameRoom = 'Sala de reunião',
): Promise<CreateRoomResponse> {
    const response = await app.inject({
        method: 'POST',
        url: '/room',
        headers: { authorization: `Bearer ${token}` },
        payload: { nameRoom },
    })

    if (response.statusCode !== 201) {
        throw new Error(
            `Não foi possível criar a sala de teste: ${response.statusCode} ${response.body}`,
        )
    }

    return response.json().room
}
