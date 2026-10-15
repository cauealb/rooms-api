import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../../app.ts'
import { createAndAuthenticateUser } from '../../../../test/utils/create-and-authenticate-user.ts'
import { createReserve } from '../../../../test/utils/create-reserve.ts'
import { createRoom } from '../../../../test/utils/create-room.ts'

describe('Cancel reserve (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    async function createPendingReserve() {
        const { token, user } = await createAndAuthenticateUser(app)
        const room = await createRoom(app, token)

        const reserve = await createReserve(app, {
            token,
            idRoom: room.idRoom,
            idUser: user.idUser,
            startOfReserve: '2026-11-10T10:00:00.000Z',
            endOfReserve: '2026-11-10T12:00:00.000Z',
        })

        return { token, reserve }
    }

    it('should be able to cancel a pending reserve', async () => {
        const { token, reserve } = await createPendingReserve()

        const response = await app.inject({
            method: 'PATCH',
            url: `/cancel/reserve/${reserve.idReserve}`,
            headers: { authorization: `Bearer ${token}` },
        })

        expect(response.statusCode).toBe(200)
        expect(response.json().reserve).toEqual(
            expect.objectContaining({
                idReserve: reserve.idReserve,
                status: 'CANCELED',
            }),
        )
    })

    it('should be able to cancel a confirmed reserve', async () => {
        const { token, reserve } = await createPendingReserve()

        await app.inject({
            method: 'PATCH',
            url: `/confirm/reserve/${reserve.idReserve}`,
            headers: { authorization: `Bearer ${token}` },
        })

        const response = await app.inject({
            method: 'PATCH',
            url: `/cancel/reserve/${reserve.idReserve}`,
            headers: { authorization: `Bearer ${token}` },
        })

        expect(response.statusCode).toBe(200)
        expect(response.json().reserve.status).toBe('CANCELED')
    })

    it('should not be able to cancel a reserve without a token', async () => {
        const { reserve } = await createPendingReserve()

        const response = await app.inject({
            method: 'PATCH',
            url: `/cancel/reserve/${reserve.idReserve}`,
        })

        expect(response.statusCode).toBe(401)
    })

    it('should not be able to cancel a reserve that does not exist', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const response = await app.inject({
            method: 'PATCH',
            url: `/cancel/reserve/${randomUUID()}`,
            headers: { authorization: `Bearer ${token}` },
        })

        expect(response.statusCode).toBe(404)
        expect(response.json().message).toBe('Reserve does not exist!')
    })

    it('should not be able to cancel a reserve twice', async () => {
        const { token, reserve } = await createPendingReserve()

        await app.inject({
            method: 'PATCH',
            url: `/cancel/reserve/${reserve.idReserve}`,
            headers: { authorization: `Bearer ${token}` },
        })

        const response = await app.inject({
            method: 'PATCH',
            url: `/cancel/reserve/${reserve.idReserve}`,
            headers: { authorization: `Bearer ${token}` },
        })

        expect(response.statusCode).toBe(400)
        expect(response.json().message).toBe('This reservation has already been cancelled!')
    })
})
