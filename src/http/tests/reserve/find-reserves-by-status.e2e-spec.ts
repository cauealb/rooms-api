import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../../app.ts'
import { createAndAuthenticateUser } from '../../../../test/utils/create-and-authenticate-user.ts'
import { createReserve } from '../../../../test/utils/create-reserve.ts'
import { createRoom } from '../../../../test/utils/create-room.ts'

describe('Find reserves by status (e2e)', () => {
    let token: string
    let pending: string
    let confirmed: string
    let canceled: string

    beforeAll(async () => {
        await app.ready()

        const auth = await createAndAuthenticateUser(app)
        token = auth.token
        const room = await createRoom(app, token)

        const reserve = (startOfReserve: string, endOfReserve: string) =>
            createReserve(app, {
                token,
                idRoom: room.idRoom,
                idUser: auth.user.idUser,
                startOfReserve,
                endOfReserve,
            })

        pending = (await reserve('2026-11-10T08:00:00.000Z', '2026-11-10T09:00:00.000Z')).idReserve
        confirmed = (await reserve('2026-11-10T09:00:00.000Z', '2026-11-10T10:00:00.000Z')).idReserve
        canceled = (await reserve('2026-11-10T10:00:00.000Z', '2026-11-10T11:00:00.000Z')).idReserve

        await app.inject({
            method: 'PATCH',
            url: `/confirm/reserve/${confirmed}`,
            headers: { authorization: `Bearer ${token}` },
        })
        await app.inject({
            method: 'PATCH',
            url: `/cancel/reserve/${canceled}`,
            headers: { authorization: `Bearer ${token}` },
        })
    })

    afterAll(async () => {
        await app.close()
    })

    it.each([
        ['PENDING', () => pending],
        ['CONFIRMED', () => confirmed],
        ['CANCELED', () => canceled],
    ])('should return only the %s reserves', async (status, expectedId) => {
        const response = await app.inject({
            method: 'GET',
            url: `/reserves/${status}`,
            headers: { authorization: `Bearer ${token}` },
        })

        expect(response.statusCode).toBe(200)
        expect(response.json().reserves).toEqual([
            expect.objectContaining({ idReserve: expectedId(), status }),
        ])
    })

    it('should not accept an invalid status', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/reserves/INVALIDO',
            headers: { authorization: `Bearer ${token}` },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should not be able to search without a token', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/reserves/PENDING',
        })

        expect(response.statusCode).toBe(401)
    })
})
