import { CashRegister } from '../interfaces/box.interface'
import pool from "../config/connectDB";

export const getAllCashRegisters = async (): Promise<CashRegister[]> => {
    const res = await pool.query("SELECT * FROM box");
    return res.rows;
}

export const saveCashRegister = async (registerData: CashRegister): Promise<CashRegister> => {
    const res = await pool.query("INSERT INTO box (openingdate, closingdate, openingamount, closingamount, expectedamount, difference, totalsales, totalexpenses, cashsales, cardsales, transfersales, status, openedby, closedby, transactions, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *", [
        registerData.openingdate,
        registerData.closingdate || null,
        registerData.openingamount,
        registerData.closingamount || null,
        registerData.expectedamount || null,
        registerData.difference || null,
        registerData.totalsales || 0,
        registerData.totalexpenses || 0,
        registerData.cashsales || 0,
        registerData.cardsales || 0,
        registerData.transfersales || 0,
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
            closingdate = $1,
            closingamount = $2,
            difference = $3,
            totalsales = $4,
            totalexpenses = $5,
            cashsales = $6,
            cardsales = $7,
            transfersales = $8,
            status = $9,
            closedby = $10,
            transactions = $11,
            notes = $12
        WHERE id = $13
        RETURNING *`,
        [
            registerData.closingdate || null,
            registerData.closingamount || null,
            registerData.difference || null,
            registerData.totalsales,
            registerData.totalexpenses,
            registerData.cashsales,
            registerData.cardsales,
            registerData.transfersales,
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
