import type { UserCreate, User } from "../../types/user.ts";
import type { userRepository } from "../user-repository.ts";

export class InMemoryUser implements userRepository {
    private item: User[] = []

    async create(data: UserCreate) {
        const user: User = {
            idUser: 'user-01',
            name: data.name
        }

        this.item.push(user)
        return user
    }
}