import { getAllCashRegisters, saveCashRegister } from '../services/box.service';
import {Request, Response} from 'express'

export const fetchAllCashRegisters = async (req: Request, res: Response): Promise<void> => {
    try {
        const registers = await getAllCashRegisters();
        res.json(registers);
    } catch (error) {
        console.error("Error fetching cash registers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createCashRegister = async (req: Request, res: Response): Promise<void> => {
    try {
        const newRegister = req.body;
        const savedRegister = await saveCashRegister(newRegister);
        res.status(201).json(savedRegister);
    } catch (error) {
        console.error("Error creating cash register:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
