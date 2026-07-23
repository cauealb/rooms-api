export interface RoomsCreate {
    nameRoom: string
    countReserve: number
}

export interface Rooms extends RoomsCreate {
    idRoom: string
}