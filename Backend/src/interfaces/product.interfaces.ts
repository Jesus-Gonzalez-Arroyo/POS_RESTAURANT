export interface Product {
    id: number;
    name: string;
    price: string;
    earnings: string;
    category: string;
    availability: string;
    stock: string; // bigint stored as string to avoid precision loss
    img?: Buffer | null;
}
