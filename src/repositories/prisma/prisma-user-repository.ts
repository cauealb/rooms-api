import { prisma } from "../../lib/prisma.ts";
import type { User } from "../../types/user.ts";
import type { userRepository } from "../user-repository.ts";

export class PrismaUserRepository implements userRepository {
    async create(data: User) {
        return await prisma.user.create({
            data: data
        })
    }

    async findById(idUser: string) {
        const user = await prisma.user.findUnique({ where: { idUser: idUser } })

        if(!user) return null

        return user
    }
}