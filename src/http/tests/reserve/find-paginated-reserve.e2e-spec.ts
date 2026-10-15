import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../../app.ts'
import { createAndAuthenticateUser } from '../../../../test/utils/create-and-authenticate-user.ts'
import { createReserve } from '../../../../test/utils/create-reserve.ts'
import { createRoom } from '../../../../test/utils/create-room.ts'

describe('Find paginated reserves (e2e)', () => {
    let token: string

    beforeAll(async () => {
        await app.ready()

        const auth = await createAndAuthenticateUser(app)
        token = auth.token
        const room = await createRoom(app, token)

        // 22 reservas de 1h, uma após a outra, a partir de 01/12/2026 00:00 UTC.
        for (let hour = 0; hour < 22; hour++) {
            await createReserve(app, {
                token,
                idRoom: room.idRoom,
                idUser: auth.user.idUser,
                startOfReserve: new Date(Date.UTC(2026, 11, 1, hour)).toISOString(),
                endOfReserve: new Date(Date.UTC(2026, 11, 1, hour + 1)).toISOString(),
            })
        }
    })

    afterAll(async () => {
        await app.close()
    })

    it('should return the first 20 reserves on page 1', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/reserve/1',
            headers: { authorization: `Bearer ${token}` },
        })

        expect(response.statusCode).toBe(200)

        const { reserves } = response.json()
        expect(reserves).toHaveLength(20)
        expect(reserves[0].startOfReserve).toBe('2026-12-01T00:00:00.000Z')
        expect(reserves[19].startOfReserve).toBe('2026-12-01T19:00:00.000Z')
    })

    it('should return the remaining reserves on page 2', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/reserve/2',
            headers: { authorization: `Bearer ${token}` },
        })

        expect(response.statusCode).toBe(200)
        expect(response.json().reserves).toEqual([
            expect.objectContaining({ startOfReserve: '2026-12-01T20:00:00.000Z' }),
            expect.objectContaining({ startOfReserve: '2026-12-01T21:00:00.000Z' }),
        ])
    })

    it('should return an empty list for a page past the end', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/reserve/3',
            headers: { authorization: `Bearer ${token}` },
        })

        expect(response.statusCode).toBe(200)
        expect(response.json().reserves).toEqual([])
    })

    it('should not accept a page lower than 1', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/reserve/0',
            headers: { authorization: `Bearer ${token}` },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should not be able to list reserves without a token', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/reserve/1',
        })

        expect(response.statusCode).toBe(401)
    })
})
