import type { UserCreate, User } from "../../types/user.ts";
import type { userRepository } from "../user-repository.ts";

export class InMemoryUser implements userRepository {
    private item: User[] = []

    async create(data: User) {
        const user: User = {
            idUser: data.idUser ?? 'user-01',
            name: data.name
        }

        this.item.push(user)
        return user
    }

    async findById(idUser: string) {
        const user = this.item.find(user => user.idUser === idUser);

        if(!user) {
            return null
        }

        return user
    }
}