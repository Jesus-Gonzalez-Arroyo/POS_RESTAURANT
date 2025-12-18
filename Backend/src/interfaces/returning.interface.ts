export interface ReturnProduct {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

export interface ReturnData {
    saleId: number;
    customer: string;
    products: ReturnProduct[];
    total: number;
    reason: string;
}