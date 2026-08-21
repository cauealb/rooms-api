import type { FastifyInstance } from "fastify";
import { createUser } from "./create-user.controller.ts";
import { refreshToken } from "./refresh-token.controller.ts";

export async function userRoutes(app: FastifyInstance) {
    app.post('/user', createUser)
    app.post('/refresh', refreshToken)
}