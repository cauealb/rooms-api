import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../../app.ts'
import { createAndAuthenticateUser } from '../../../../test/utils/create-and-authenticate-user.ts'

describe('Create room (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a room', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const response = await app.inject({
            method: 'POST',
            url: '/room',
            headers: { authorization: `Bearer ${token}` },
            payload: { nameRoom: 'Sala de reunião' },
        })

        expect(response.statusCode).toBe(201)
        expect(response.json()).toEqual({
            room: {
                idRoom: expect.any(String),
                nameRoom: 'Sala de reunião',
            },
        })
    })

    it('should not be able to create a room without a token', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/room',
            payload: { nameRoom: 'Sala de reunião' },
        })

        expect(response.statusCode).toBe(401)
    })

    it('should not be able to create a room with an invalid token', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/room',
            headers: { authorization: 'Bearer token-invalido' },
            payload: { nameRoom: 'Sala de reunião' },
        })

        expect(response.statusCode).toBe(401)
    })

    it('should not be able to create a room without a name', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const response = await app.inject({
            method: 'POST',
            url: '/room',
            headers: { authorization: `Bearer ${token}` },
            payload: {},
        })

        expect(response.statusCode).toBe(400)
    })

    it('should not be able to create a room with an empty name', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const response = await app.inject({
            method: 'POST',
            url: '/room',
            headers: { authorization: `Bearer ${token}` },
            payload: { nameRoom: '' },
        })

        expect(response.statusCode).toBe(400)
        expect(response.json().message).toBe('Invalid room name for creation!')
    })
})
