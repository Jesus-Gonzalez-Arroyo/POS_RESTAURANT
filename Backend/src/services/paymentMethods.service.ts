import pool from "../config/connectDB";
import { PaymentMethod } from "../interfaces/paymentMethods.interface";

export const getPaymentMethods = async () => {
    const res = await pool.query('SELECT * FROM payment_methods');
    return res.rows;
}

export const addPaymentMethod = async (paymentMethod: PaymentMethod) => {
    const { name, description, is_active, color, icon, created_at, updated_at } = paymentMethod;
    const res = await pool.query(
        'INSERT INTO payment_methods (name, description, is_active, color, icon, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name, description, is_active, color, icon, created_at, updated_at]
    );
    return res.rows[0];
}

export const deletePaymentMethod = async (id: number) => {
    const res = await pool.query(
        'DELETE FROM payment_methods WHERE id = $1 RETURNING *',
        [id]
    );
    return res.rows[0];
}

export const updatePaymentMethod = async (id: number, paymentMethod: PaymentMethod) => {
    const { name, description, is_active, color, icon, created_at, updated_at } = paymentMethod;
    const res = await pool.query(
        'UPDATE payment_methods SET name = $1, description = $2, is_active = $3, color = $4, icon = $5, created_at = $6, updated_at = $7 WHERE id = $8 RETURNING *',
        [name, description, is_active, color, icon, created_at, updated_at, id]
    );
    return res.rows[0];
}

export const updateStatePaymentMethod = async (id: number, isActive: boolean, updatedAt: Date) => {
    const res = await pool.query(
        'UPDATE payment_methods SET is_active = $1, updated_at = $2 WHERE id = $3 RETURNING *',
        [isActive, updatedAt, id]
    );
    return res.rows[0];
}
