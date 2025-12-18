import { getAllReturns, processReturn } from '../services/returning.service'
import { Request, Response } from 'express'

export const handleProcessReturn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { saleId, customer, products, total, reason } = req.body;
        const returnData = { saleId, customer, products, total, reason };
        const processedReturn = await processReturn(returnData);
        res.status(201).json({ message: 'Devolución procesada con éxito', return: processedReturn });
    } catch (error) {
        console.error('Error procesando devolución:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const handleGetAllReturns = async (req: Request, res: Response): Promise<void> => {
    try {
        const returns = await getAllReturns();
        res.json(returns);
    } catch (error) {
        console.error('Error obteniendo devoluciones:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}