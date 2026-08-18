import type { FastifyInstance } from "fastify";
import { createRoom } from "./create-room.controller.ts";
import { verifyToken } from "../../../middlewares/verify-token.ts";

export async function roomRoutes(app: FastifyInstance) {
    app.post('/room', {onRequest: [verifyToken]}, createRoom)
}