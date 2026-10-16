import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../../app.ts'

describe('Create user (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a user', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/user',
            payload: {
                name: 'Cauê',
                email: 'caue@rooms-api.test',
                password: 'admin123',
            },
        })

        expect(response.statusCode).toBe(201)
        expect(response.json()).toEqual({
            user: expect.objectContaining({
                idUser: expect.any(String),
                name: 'Cauê',
                email: 'caue@rooms-api.test',
            }),
            token: expect.any(String),
        })
    })

    it('should store the password as a hash', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/user',
            payload: {
                name: 'Cauê',
                email: 'hash@rooms-api.test',
                password: 'admin123',
            },
        })

        expect(response.json().user.password).not.toBe('admin123')
    })

    it('should set the refresh token in an httpOnly cookie', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/user',
            payload: {
                name: 'Cauê',
                email: 'cookie@rooms-api.test',
                password: 'admin123',
            },
        })

        const refreshToken = response.cookies.find(
            (cookie) => cookie.name === 'refreshToken',
        )

        expect(refreshToken).toEqual(
            expect.objectContaining({
                value: expect.any(String),
                httpOnly: true,
                path: '/',
            }),
        )
    })

    it('should not be able to create a user with an invalid email', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/user',
            payload: {
                name: 'Cauê',
                email: 'email-invalido',
                password: 'admin123',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should not be able to create a user without required fields', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/user',
            payload: {},
        })

        expect(response.statusCode).toBe(400)
    })

    it('should not be able to create a user with a name of one character', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/user',
            payload: {
                name: 'C',
                email: 'curto@rooms-api.test',
                password: 'admin123',
            },
        })

        expect(response.statusCode).toBe(400)
        expect(response.json().message).toBe('Invalid input for creating a user!')
    })

    it("should be able validate the same email", async () => {
        await app.inject({
            method: 'POST',
            url: '/user',
            payload: {
                name: 'Caue',
                email: 'caue@gmail.com',
                password: 'admin123',
            }
        })

        const response = await app.inject({
            method: 'POST',
            url: '/user',
            payload: {
                name: 'Caue',
                email: 'caue@gmail.com',
                password: 'admin123',
            }
        })

        expect(response.json().message).toEqual('Email has alredy exists')
    })
})
