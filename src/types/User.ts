export interface UserCreate {
    name: string
}

export interface User extends UserCreate {
    idUser: string
}