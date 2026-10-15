import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../../app.ts'
import { createAndAuthenticateUser } from '../../../../test/utils/create-and-authenticate-user.ts'
import { createReserve } from '../../../../test/utils/create-reserve.ts'
import { createRoom } from '../../../../test/utils/create-room.ts'

describe('Find reserves between dates (e2e)', () => {
    let token: string
    let morning: string
    let afternoon: string
    let nextDay: string

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

        morning = (await reserve('2026-11-10T08:00:00.000Z', '2026-11-10T10:00:00.000Z')).idReserve
        afternoon = (await reserve('2026-11-10T14:00:00.000Z', '2026-11-10T16:00:00.000Z')).idReserve
        nextDay = (await reserve('2026-11-11T08:00:00.000Z', '2026-11-11T10:00:00.000Z')).idReserve

        const canceled = await reserve('2026-11-10T11:00:00.000Z', '2026-11-10T12:00:00.000Z')
        await app.inject({
            method: 'PATCH',
            url: `/cancel/reserve/${canceled.idReserve}`,
            headers: { authorization: `Bearer ${token}` },
        })
    })

    afterAll(async () => {
        await app.close()
    })

    function findBetween(startAt: string, endAt: string) {
        return app.inject({
            method: 'GET',
            url: '/reserve/between-dates',
            headers: { authorization: `Bearer ${token}` },
            query: { startAt, endAt },
        })
    }

    function ids(response: Awaited<ReturnType<typeof findBetween>>) {
        return response.json().reserves.map((r: { idReserve: string }) => r.idReserve).sort()
    }

    it('should return the reserves within the period', async () => {
        const response = await findBetween('2026-11-10T00:00:00.000Z', '2026-11-10T23:59:59.999Z')

        expect(response.statusCode).toBe(200)
        expect(ids(response)).toEqual([morning, afternoon].sort())
    })

    it('should return reserves that partially overlap the period', async () => {
        const response = await findBetween('2026-11-10T09:00:00.000Z', '2026-11-10T15:00:00.000Z')

        expect(response.statusCode).toBe(200)
        expect(ids(response)).toEqual([morning, afternoon].sort())
    })

    it('should not return canceled reserves', async () => {
        const response = await findBetween('2026-11-10T11:00:00.000Z', '2026-11-10T12:00:00.000Z')

        expect(response.statusCode).toBe(200)
        expect(response.json().reserves).toEqual([])
    })

    it('should return an empty list when there are no reserves in the period', async () => {
        const response = await findBetween('2027-01-01T00:00:00.000Z', '2027-01-31T00:00:00.000Z')

        expect(response.statusCode).toBe(200)
        expect(response.json().reserves).toEqual([])
    })

    it('should return reserves across multiple days', async () => {
        const response = await findBetween('2026-11-10T00:00:00.000Z', '2026-11-12T00:00:00.000Z')

        expect(ids(response)).toEqual([morning, afternoon, nextDay].sort())
    })

    it('should not accept an invalid date', async () => {
        const response = await findBetween('data-invalida', '2026-11-10T23:59:59.999Z')

        expect(response.statusCode).toBe(400)
        expect(response.json().message).toBe('Invalid date format!')
    })

    it('should not accept a start date after the end date', async () => {
        const response = await findBetween('2026-11-11T00:00:00.000Z', '2026-11-10T00:00:00.000Z')

        expect(response.statusCode).toBe(400)
        expect(response.json().message).toBe('Invalid date format!')
    })

    it('should not accept a request without the dates', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/reserve/between-dates',
            headers: { authorization: `Bearer ${token}` },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should not be able to search without a token', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/reserve/between-dates',
            query: { startAt: '2026-11-10T00:00:00.000Z', endAt: '2026-11-11T00:00:00.000Z' },
        })

        expect(response.statusCode).toBe(401)
    })
})
