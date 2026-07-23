import type { User, UserCreate } from "../types/user.ts";

export interface userRepository {
    create(data: UserCreate): Promise<User>
}

