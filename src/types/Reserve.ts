export interface ReserveCreate {
    idRoom: string
    idUser: string
    startOfReserve: Date
    endOfReserve: Date
}

export interface Reserve extends ReserveCreate {
    idReserve?: string
    status: string
}