export interface SaleCreate {
    customer: string;
    total: number;
    paymentmethod: string;
    products: any;
    time: Date;
    ganancias: string;
}