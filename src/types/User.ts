export interface UserCreate {
    name: string
    email: string,
    password: string
}

export interface User extends UserCreate {
    idUser: string
}