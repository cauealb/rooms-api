import type { User, UserCreate } from "../types/User.ts";

export interface userRepository {
    create(data: UserCreate): Promise<User>
}

