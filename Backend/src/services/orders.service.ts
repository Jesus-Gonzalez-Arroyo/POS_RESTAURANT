import pool from "../config/connectDB";

interface Order {
    id: number;
    customer: string;
    total: string;
    isDelivery: boolean;
    deliveryAddress: string | null;
    paymentMethod: string;
    products: Array<{ name: string; price: string; quantity: number }>;
    status: string;
    timestamp: Date;
}

export const getAllOrders = async (): Promise<any[]> => {
    const res = await pool.query("SELECT * FROM orders");
    return res.rows;
}

export const saveOrder = async (orderData: Order): Promise<any> => {
    const res = await pool.query("INSERT INTO orders (customer, total, status, products, isdelivery, deliveryaddress, paymentmethod, time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [
        orderData.customer,
        orderData.total,
        orderData.status,
        JSON.stringify(orderData.products),
        orderData.isDelivery,
        orderData.deliveryAddress,
        orderData.paymentMethod,
        orderData.timestamp
    ]);

    return res.rows[0];
}

export const deleteOrderById = async (id: number): Promise<void> => {
    const res = await pool.query("DELETE FROM orders WHERE id = $1 RETURNING *", [id]);

    if (res.rowCount === 0) {
        throw new Error("Order not found");
    }

    return res.rows[0];
}