import { Order } from '../interfaces/orders.interface'
import pool from "../config/connectDB";

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
        orderData.isdelivery,
        orderData.deliveryaddress,
        orderData.paymentmethod,
        orderData.time
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