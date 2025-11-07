import { Bill } from "../interfaces/bills.interface";
import pool from "../config/connectDB";

export const getAllBills = async (): Promise<Bill[]> => {
    const res = await pool.query("SELECT * FROM bills");
    return res.rows;
}

export const createBill = async (bill: Omit<Bill, 'id'>): Promise<Bill> => {
    const { description, amount, category, date, notes, paymentmethod, createdby } = bill;
    const res = await pool.query(
        "INSERT INTO bills (description, amount, category, date, notes, paymentmethod, createdby) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [description, amount, category, date, notes, paymentmethod, createdby]
    );
    return res.rows[0];
}

export const updateBill = async (id: number, billData: Partial<Omit<Bill, 'id'>>): Promise<Bill> => {
    const { description, amount, category, date, notes, paymentmethod, createdby } = billData;
    const res = await pool.query(
        `UPDATE bills SET
            description = $1,
            amount = $2,
            category = $3,
            date = $4,
            notes = $5,
            paymentmethod = $6,
            createdby = $7
        WHERE id = $8
        RETURNING *`,
        [description, amount, category, date, notes, paymentmethod, createdby, id]
    );
    return res.rows[0];
}

export const deleteBill = async (id: number): Promise<void> => {
    await pool.query("DELETE FROM bills WHERE id = $1", [id]);
}

