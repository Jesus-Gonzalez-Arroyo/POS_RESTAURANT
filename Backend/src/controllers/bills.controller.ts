import { Request, Response } from 'express'
import { getAllBills, createBill, updateBill, deleteBill } from '../services/bills.service';

export const fetchAllBills = async (req: Request, res: Response): Promise<void> => {
    try {
        const bills = await getAllBills();
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bills' });
    }
}

export const addBill = async (req: Request, res: Response): Promise<void> => {
    try {
        const newBill = req.body;
        const createdBill = await createBill(newBill);
        res.status(201).json(createdBill);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create bill' });
    }
}

export const editBill = async (req: Request, res: Response): Promise<void> => {
    try {
        const billId = parseInt(req.params.id, 10);
        const updatedBill = await updateBill(billId, req.body);
        res.status(200).json(updatedBill);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update bill' });
    }
}

export const removeBill = async (req: Request, res: Response): Promise<void> => {
    try {
        const billId = parseInt(req.params.id, 10);
        await deleteBill(billId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete bill' });
    }
}
