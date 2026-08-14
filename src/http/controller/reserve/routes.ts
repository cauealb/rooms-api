import type { FastifyInstance } from "fastify";
import { createReserve } from "./create-reserve.controller.ts";
import { confirmReserve } from "./confirm-reserve.controller.ts";
import { cancelReserve } from "./cancel-reserve.controller.ts";

export async function reservesRoutes(app: FastifyInstance) {
    app.post('/reserve', createReserve)

    app.patch('/confirm/reserve/:idReserve', confirmReserve)
    app.patch('/cancel/reserve/:idReserve', cancelReserve)
}