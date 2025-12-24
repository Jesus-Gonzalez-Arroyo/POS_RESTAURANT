import { CashRegister } from '../interfaces/box.interface'
import pool from "../config/connectDB";

export const getAllCashRegisters = async (): Promise<CashRegister[]> => {
    const res = await pool.query("SELECT * FROM box");
    return res.rows;
}

export const saveCashRegister = async (registerData: CashRegister): Promise<CashRegister> => {
    const res = await pool.query("INSERT INTO box (openingdate, closingdate, openingamount, closingamount, expectedamount, difference, totalsales, totalexpenses, salesbymethod, status, openedby, closedby, transactions, notes) VALUES (timezone('America/Bogota', $1::timestamp), timezone('America/Bogota', $2::timestamp), $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *", [
        registerData.openingdate,
        registerData.closingdate || null,
        registerData.openingamount,
        registerData.closingamount || null,
        registerData.expectedamount || null,
        registerData.difference || null,
        registerData.totalsales || 0,
        registerData.totalexpenses || 0,
        JSON.stringify(registerData.salesbymethod || {}),
        registerData.status,
        registerData.openedby,
        registerData.closedby || null,
        JSON.stringify(registerData.transactions || []),
        registerData.notes || null
    ]);
    return res.rows[0];
}

export const updateCashRegister = async (id: string, registerData: Partial<CashRegister>): Promise<CashRegister> => {
    const res = await pool.query(
        `UPDATE box SET 
            closingdate = timezone('America/Bogota', $1::timestamp),
            closingamount = $2,
            difference = $3,
            totalsales = $4,
            totalexpenses = $5,
            salesbymethod = $6,
            status = $7,
            closedby = $8,
            transactions = $9,
            notes = $10
        WHERE id = $11
        RETURNING *`,
        [
            registerData.closingdate || null,
            registerData.closingamount || null,
            registerData.difference || null,
            registerData.totalsales,
            registerData.totalexpenses,
            JSON.stringify(registerData.salesbymethod || {}),
            registerData.status,
            registerData.closedby || null,
            JSON.stringify(registerData.transactions || []),
            registerData.notes || null,
            id
        ]
    );
    return res.rows[0];
}

export const getOpenCashRegister = async (): Promise<CashRegister | null> => {
    const res = await pool.query("SELECT * FROM box WHERE status = 'abierta' ORDER BY openingdate DESC LIMIT 1");
    return res.rows[0] || null;
}

export const getCashRegisterById = async (id: string): Promise<CashRegister | null> => {
    const res = await pool.query("SELECT * FROM box WHERE id = $1", [id]);
    return res.rows[0] || null;
}
