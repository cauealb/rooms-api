import type { FastifyInstance } from "fastify";
import { createRoom } from "./create-room.controller.ts";

export async function roomRoutes(app: FastifyInstance) {
    app.post('/room', createRoom)
}