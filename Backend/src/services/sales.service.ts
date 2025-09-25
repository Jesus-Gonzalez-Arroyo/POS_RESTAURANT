import pool from "../config/connectDB";

export const getAllSales = async () => {
    const res = await pool.query('SELECT * FROM sales');
    return res.rows;
}

