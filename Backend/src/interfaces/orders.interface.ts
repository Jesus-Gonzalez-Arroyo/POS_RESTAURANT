export interface Order {
    id: number;
    customer: string;
    total: string;
    isdelivery: boolean;
    deliveryaddress: string | null;
    paymentmethod: string;
    products: Array<{ name: string; price: string; quantity: number }>;
    status: string;
    time: Date;
}