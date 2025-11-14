import { Request, Response } from 'express'
import { getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, updateStatePaymentMethod } from '../services/paymentMethods.service';

export const getAllPaymentMethods = async (req: Request, res: Response): Promise<void> => {
    try {
        const paymentMethods = await getPaymentMethods();
        res.status(200).json(paymentMethods);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payment methods' });
    }
}

export const createPaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
        const newPaymentMethod = req.body;
        const createdPaymentMethod = await addPaymentMethod(newPaymentMethod);
        res.status(201).json(createdPaymentMethod);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create payment method' });
    }   
}

export const editPaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
        const paymentMethodId = parseInt(req.params.id, 10);
        const updatedPaymentMethod = await updatePaymentMethod(paymentMethodId, req.body);
        res.status(200).json(updatedPaymentMethod);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update payment method' });
    }
}

export const removePaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
        const paymentMethodId = parseInt(req.params.id, 10);
        const result = await deletePaymentMethod(paymentMethodId);
        res.status(204).send(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete payment method' });
    }
}

export const togglePaymentMethodState = async (req: Request, res: Response): Promise<void> => {
    try {
        const paymentMethodId = parseInt(req.params.id, 10);
        const { isActive, updatedAt } = req.body;
        const updatedPaymentMethod = await updateStatePaymentMethod(paymentMethodId, isActive, updatedAt);
        res.status(200).json(updatedPaymentMethod);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update payment method state' });
    }
}
