import pool from "../config/connectDB";
import { SaleCreate } from "../interfaces/sales.interfaces";

export const getAllSales = async () => {
    const res = await pool.query('SELECT * FROM sales');
    return res.rows;
}

export const createSale = async (sale: SaleCreate) => {
    const { customer, total, paymentmethod, products, time } = sale;
    const ganancias = products.reduce((acc: number, product: any) => acc + (parseInt(product.earnings) * product.quantity), 0).toString();
    const res = await pool.query(
        'INSERT INTO sales (customer, total, paymentmethod, products, time, ganancias) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [customer, total, paymentmethod, JSON.stringify(products), time, ganancias]
    );
    return res.rows[0];
}

