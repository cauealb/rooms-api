import type { FastifyReply, FastifyRequest } from "fastify";
import { SessionExpiredError } from "../errors/session-expired-error.ts";

export async function verifyToken(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify()
    } catch (ex) {
        throw new SessionExpiredError
    }
}