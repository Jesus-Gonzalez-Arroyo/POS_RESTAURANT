export interface SaleCreate {
    customer: string;
    total: number;
    paymentmethod: string;
    paymentbreakdown?: { method: string; amount: number }[];
    products: any;
    time: Date;
    ganancias: string;
}