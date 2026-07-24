import type { User } from "../types/user.ts";

export interface userRepository {
    create(data: User): Promise<User>
    findById(idUser: string): Promise<User | null>
}

