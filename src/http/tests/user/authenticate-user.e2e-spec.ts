import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../../app.ts'
import { createAndAuthenticateUser } from '../../../../test/utils/create-and-authenticate-user.ts'

describe('Authenticate user (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to authenticate', async () => {
        const { user, password } = await createAndAuthenticateUser(app)

        const response = await app.inject({
            method: 'POST',
            url: '/session',
            payload: { email: user.email, password },
        })

        expect(response.statusCode).toBe(200)
        expect(response.json()).toEqual({
            user: expect.objectContaining({
                idUser: user.idUser,
                email: user.email,
            }),
            token: expect.any(String),
        })
        expect(
            response.cookies.find((cookie) => cookie.name === 'refreshToken'),
        ).toEqual(expect.objectContaining({ value: expect.any(String), httpOnly: true }))
    })

    it('should return a token that grants access to protected routes', async () => {
        const { user, password } = await createAndAuthenticateUser(app)

        const sessionResponse = await app.inject({
            method: 'POST',
            url: '/session',
            payload: { email: user.email, password },
        })

        const response = await app.inject({
            method: 'POST',
            url: '/room',
            headers: { authorization: `Bearer ${sessionResponse.json().token}` },
            payload: { nameRoom: 'Sala 01' },
        })

        expect(response.statusCode).toBe(201)
    })

    it('should not be able to authenticate with a wrong password', async () => {
        const { user } = await createAndAuthenticateUser(app)

        const response = await app.inject({
            method: 'POST',
            url: '/session',
            payload: { email: user.email, password: 'senha-errada' },
        })

        expect(response.statusCode).toBe(401)
        expect(response.cookies).toHaveLength(0)
    })

    it('should not be able to authenticate with an unregistered email', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/session',
            payload: { email: 'ninguem@rooms-api.test', password: 'admin123' },
        })

        expect(response.statusCode).toBe(401)
    })

    it('should not be able to authenticate with an invalid body', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/session',
            payload: { email: 'email-invalido' },
        })

        expect(response.statusCode).toBe(400)
    })
})
