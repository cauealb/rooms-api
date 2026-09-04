import { prisma } from "../../lib/prisma.ts";
import type { User } from "../../types/User.ts";
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

    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findFirst({ where: { email: email } })

        if(!user) return null
        
        return user
    }
}