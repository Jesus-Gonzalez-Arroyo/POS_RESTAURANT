import { Request, Response } from 'express'
import { sendCashRegisterOpeningEmail, sendCashRegisterClosingEmail } from '../services/emails.service'

export const sendRegisterOpeningEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { openingAmount, openingDate, openedBy, registerId } = req.body;
        await sendCashRegisterOpeningEmail({
            openingAmount,
            openingDate,
            openedBy,
            registerId
        });
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const sendClosingEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            registerId,
            openingDate,
            closingDate,
            openingAmount,
            closingAmount,
            expectedAmount,
            difference,
            totalSales,
            totalExpenses,
            salesByMethod,
            cashAmount,
            openedBy,
            closedBy,
            notes
        } = req.body;
        
        await sendCashRegisterClosingEmail({
            registerId,
            openingDate,
            closingDate,
            openingAmount,
            closingAmount,
            expectedAmount,
            difference,
            totalSales,
            totalExpenses,
            salesByMethod,
            cashAmount,
            openedBy,
            closedBy,
            notes
        });
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}