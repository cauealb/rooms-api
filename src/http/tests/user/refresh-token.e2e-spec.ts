import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../../app.ts'
import { createAndAuthenticateUser } from '../../../../test/utils/create-and-authenticate-user.ts'

describe('Refresh token (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to refresh the token', async () => {
        const { refreshToken } = await createAndAuthenticateUser(app)

        const response = await app.inject({
            method: 'POST',
            url: '/refresh',
            cookies: { refreshToken },
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
        expect(
            response.cookies.find((cookie) => cookie.name === 'refreshToken'),
        ).toEqual(expect.objectContaining({ value: expect.any(String), httpOnly: true }))
    })

    it('should return a token that grants access to protected routes', async () => {
        const { refreshToken } = await createAndAuthenticateUser(app)

        const refreshResponse = await app.inject({
            method: 'POST',
            url: '/refresh',
            cookies: { refreshToken },
        })

        const response = await app.inject({
            method: 'POST',
            url: '/room',
            headers: { authorization: `Bearer ${refreshResponse.body}` },
            payload: { nameRoom: 'Sala 01' },
        })

        expect(response.statusCode).toBe(201)
    })

    it('should not be able to refresh without the refresh token cookie', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/refresh',
        })

        expect(response.statusCode).toBe(401)
    })

    it('should not be able to refresh with an invalid refresh token', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/refresh',
            cookies: { refreshToken: 'token-invalido' },
        })

        expect(response.statusCode).toBe(401)
    })
})
