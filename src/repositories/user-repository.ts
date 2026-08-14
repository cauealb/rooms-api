import type { User, UserCreate } from "../types/user.ts";

export interface userRepository {
    create(data: UserCreate): Promise<User>
    findById(idUser: string): Promise<User | null>
}

