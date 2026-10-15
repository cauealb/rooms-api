import fastify, { type FastifyError } from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { ZodError } from "zod";
import { reservesRoutes } from "./src/http/controller/reserve/routes.ts";
import { roomRoutes } from "./src/http/controller/room/routes.ts";
import { env } from "./src/env/index.ts";
import { userRoutes } from "./src/http/controller/user/routes.ts";
import { AppError } from "./src/errors/app-error.ts";
export const app = fastify()

app.setErrorHandler((err, request, reply) => {
    if(err instanceof ZodError) {
        return reply.status(400).send({
            message: 'Validation error',
            issues: err.issues
        })
    }

    if(err instanceof AppError) {
        return reply.status(err.statusCode).send({
            message: err.message
        })
    }

    // Erros do próprio Fastify/plugins (ex.: @fastify/jwt) já trazem o status correto.
    const { statusCode, message } = err as FastifyError
    if(statusCode && statusCode < 500) {
        return reply.status(statusCode).send({
            message
        })
    }

    console.error(err)

    return reply.status(500).send({
        message: 'Internal server error'
    })
})

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false
    }
})
app.register(fastifyCookie)

app.register(reservesRoutes)
app.register(roomRoutes)
app.register(userRoutes)
