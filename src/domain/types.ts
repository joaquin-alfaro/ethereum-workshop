export interface BusDetail {
    make: string
    model: string
    plate: string
    seats: number
}

export interface TransferToken {
    datetime: number
    origin: string
    destination: string
}

export interface Transfer extends TransferToken {
    units: number
    price: number
    address?: string
}