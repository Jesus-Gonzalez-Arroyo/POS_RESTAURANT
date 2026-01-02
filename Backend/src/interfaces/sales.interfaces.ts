export interface SaleCreate {
    customer: string;
    total: number;
    paymentmethod: string;
    paymentbreakdown?: { method: string; amount: number }[]; // Desglose de múltiples métodos de pago
    products: any;
    time: Date;
    ganancias: string;
}