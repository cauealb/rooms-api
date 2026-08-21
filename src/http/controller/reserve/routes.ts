import type { FastifyInstance } from "fastify";
import { createReserve } from "./create-reserve.controller.ts";
import { confirmReserve } from "./confirm-reserve.controller.ts";
import { cancelReserve } from "./cancel-reserve.controller.ts";
import { findPaginatedReserve } from "./find-paginated-reserve.controller.ts";
import { findReservesBetweenDates } from "./find-reserves-between-dates.controller.ts";
import { findReservesByStatus } from "./find-reserves-by-status.controller.ts";
import { verifyToken } from "../../../middlewares/verify-token.ts";

export async function reservesRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyToken)

    app.post('/reserve', createReserve)

    app.patch('/confirm/reserve/:idReserve', confirmReserve)
    app.patch('/cancel/reserve/:idReserve', cancelReserve)

    app.get('/reserve/:page', findPaginatedReserve)
    app.get('/reserve/between-dates', findReservesBetweenDates)
    app.get('/reserves/:status', findReservesByStatus)
}