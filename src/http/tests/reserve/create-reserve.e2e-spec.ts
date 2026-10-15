import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../../app.ts'
import { createAndAuthenticateUser } from '../../../../test/utils/create-and-authenticate-user.ts'
import { createReserve } from '../../../../test/utils/create-reserve.ts'
import { createRoom } from '../../../../test/utils/create-room.ts'

describe('Create reserve (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a reserve', async () => {
        const { token, user } = await createAndAuthenticateUser(app)
        const room = await createRoom(app, token)

        const response = await app.inject({
            method: 'POST',
            url: '/reserve',
            headers: { authorization: `Bearer ${token}` },
            query: { idRoom: room.idRoom, idUser: user.idUser },
            payload: {
                startOfReserve: '2026-11-10T10:00:00.000Z',
                endOfReserve: '2026-11-10T12:00:00.000Z',
            },
        })

        expect(response.statusCode).toBe(201)
        expect(response.json()).toEqual({
            reserve: {
                idReserve: expect.any(String),
                idRoom: room.idRoom,
                idUser: user.idUser,
                status: 'PENDING',
                startOfReserve: '2026-11-10T10:00:00.000Z',
                endOfReserve: '2026-11-10T12:00:00.000Z',
            },
        })
    })

    it('should not be able to create a reserve without a token', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/reserve',
            query: { idRoom: randomUUID(), idUser: randomUUID() },
            payload: {
                startOfReserve: '2026-11-10T10:00:00.000Z',
                endOfReserve: '2026-11-10T12:00:00.000Z',
            },
        })

        expect(response.statusCode).toBe(401)
    })

    it('should not be able to create a reserve without the room and user ids', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const response = await app.inject({
            method: 'POST',
            url: '/reserve',
            headers: { authorization: `Bearer ${token}` },
            payload: {
                startOfReserve: '2026-11-10T10:00:00.000Z',
                endOfReserve: '2026-11-10T12:00:00.000Z',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should not be able to create a reserve for a room that does not exist', async () => {
        const { token, user } = await createAndAuthenticateUser(app)

        const response = await app.inject({
            method: 'POST',
            url: '/reserve',
            headers: { authorization: `Bearer ${token}` },
            query: { idRoom: randomUUID(), idUser: user.idUser },
            payload: {
                startOfReserve: '2026-11-10T10:00:00.000Z',
                endOfReserve: '2026-11-10T12:00:00.000Z',
            },
        })

        expect(response.statusCode).toBe(404)
        expect(response.json().message).toBe('Room does not exist')
    })

    it('should not be able to create a reserve for a user that does not exist', async () => {
        const { token } = await createAndAuthenticateUser(app)
        const room = await createRoom(app, token)

        const response = await app.inject({
            method: 'POST',
            url: '/reserve',
            headers: { authorization: `Bearer ${token}` },
            query: { idRoom: room.idRoom, idUser: randomUUID() },
            payload: {
                startOfReserve: '2026-11-10T10:00:00.000Z',
                endOfReserve: '2026-11-10T12:00:00.000Z',
            },
        })

        expect(response.statusCode).toBe(404)
        expect(response.json().message).toBe('User does not exist!')
    })

    it('should not be able to create a reserve with an invalid date', async () => {
        const { token, user } = await createAndAuthenticateUser(app)
        const room = await createRoom(app, token)

        const response = await app.inject({
            method: 'POST',
            url: '/reserve',
            headers: { authorization: `Bearer ${token}` },
            query: { idRoom: room.idRoom, idUser: user.idUser },
            payload: {
                startOfReserve: 'data-invalida',
                endOfReserve: '2026-11-10T12:00:00.000Z',
            },
        })

        expect(response.statusCode).toBe(400)
        expect(response.json().message).toBe('Invalid date format!')
    })

    it('should not be able to create a reserve that ends before it starts', async () => {
        const { token, user } = await createAndAuthenticateUser(app)
        const room = await createRoom(app, token)

        const response = await app.inject({
            method: 'POST',
            url: '/reserve',
            headers: { authorization: `Bearer ${token}` },
            query: { idRoom: room.idRoom, idUser: user.idUser },
            payload: {
                startOfReserve: '2026-11-10T12:00:00.000Z',
                endOfReserve: '2026-11-10T10:00:00.000Z',
            },
        })

        expect(response.statusCode).toBe(400)
        expect(response.json().message).toBe('Invalid date format!')
    })

    it.each([
        ['starts during the existing one', '2026-11-11T11:00:00.000Z', '2026-11-11T13:00:00.000Z'],
        ['ends during the existing one', '2026-11-11T09:00:00.000Z', '2026-11-11T11:00:00.000Z'],
        ['is inside the existing one', '2026-11-11T10:30:00.000Z', '2026-11-11T11:30:00.000Z'],
        ['contains the existing one', '2026-11-11T09:00:00.000Z', '2026-11-11T13:00:00.000Z'],
        ['has the same period as the existing one', '2026-11-11T10:00:00.000Z', '2026-11-11T12:00:00.000Z'],
    ])(
        'should not be able to create a reserve that %s',
        async (_, startOfReserve, endOfReserve) => {
            const { token, user } = await createAndAuthenticateUser(app)
            const room = await createRoom(app, token)

            await createReserve(app, {
                token,
                idRoom: room.idRoom,
                idUser: user.idUser,
                startOfReserve: '2026-11-11T10:00:00.000Z',
                endOfReserve: '2026-11-11T12:00:00.000Z',
            })

            const response = await app.inject({
                method: 'POST',
                url: '/reserve',
                headers: { authorization: `Bearer ${token}` },
                query: { idRoom: room.idRoom, idUser: user.idUser },
                payload: { startOfReserve, endOfReserve },
            })

            expect(response.statusCode).toBe(400)
            expect(response.json().message).toBe(
                'There is already a reservation available for that date.',
            )
        },
    )

    it('should be able to create a reserve right after an existing one', async () => {
        const { token, user } = await createAndAuthenticateUser(app)
        const room = await createRoom(app, token)

        await createReserve(app, {
            token,
            idRoom: room.idRoom,
            idUser: user.idUser,
            startOfReserve: '2026-11-12T10:00:00.000Z',
            endOfReserve: '2026-11-12T12:00:00.000Z',
        })

        const response = await app.inject({
            method: 'POST',
            url: '/reserve',
            headers: { authorization: `Bearer ${token}` },
            query: { idRoom: room.idRoom, idUser: user.idUser },
            payload: {
                startOfReserve: '2026-11-12T12:00:00.000Z',
                endOfReserve: '2026-11-12T14:00:00.000Z',
            },
        })

        expect(response.statusCode).toBe(201)
    })

    it('should be able to reserve another room in the same period', async () => {
        const { token, user } = await createAndAuthenticateUser(app)
        const room = await createRoom(app, token, 'Sala 01')
        const otherRoom = await createRoom(app, token, 'Sala 02')

        await createReserve(app, {
            token,
            idRoom: room.idRoom,
            idUser: user.idUser,
            startOfReserve: '2026-11-13T10:00:00.000Z',
            endOfReserve: '2026-11-13T12:00:00.000Z',
        })

        const response = await app.inject({
            method: 'POST',
            url: '/reserve',
            headers: { authorization: `Bearer ${token}` },
            query: { idRoom: otherRoom.idRoom, idUser: user.idUser },
            payload: {
                startOfReserve: '2026-11-13T10:00:00.000Z',
                endOfReserve: '2026-11-13T12:00:00.000Z',
            },
        })

        expect(response.statusCode).toBe(201)
    })

    it('should be able to reserve a period that only conflicts with a canceled reserve', async () => {
        const { token, user } = await createAndAuthenticateUser(app)
        const room = await createRoom(app, token)

        const canceled = await createReserve(app, {
            token,
            idRoom: room.idRoom,
            idUser: user.idUser,
            startOfReserve: '2026-11-14T10:00:00.000Z',
            endOfReserve: '2026-11-14T12:00:00.000Z',
        })

        await app.inject({
            method: 'PATCH',
            url: `/cancel/reserve/${canceled.idReserve}`,
            headers: { authorization: `Bearer ${token}` },
        })

        const response = await app.inject({
            method: 'POST',
            url: '/reserve',
            headers: { authorization: `Bearer ${token}` },
            query: { idRoom: room.idRoom, idUser: user.idUser },
            payload: {
                startOfReserve: '2026-11-14T10:00:00.000Z',
                endOfReserve: '2026-11-14T12:00:00.000Z',
            },
        })

        expect(response.statusCode).toBe(201)
    })
})
