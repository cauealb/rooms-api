import type { User, UserCreate } from "../types/User.ts";

export interface userRepository {
    create(data: UserCreate): Promise<User>

    findByEmail(email: string): Promise<User | null>
    findById(idUser: string): Promise<User | null>
}

