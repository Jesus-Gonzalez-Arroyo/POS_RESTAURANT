import { createSale, getAllSales } from "../services/sales.service";
import { Request, Response } from "express";

export const getSalesAll = async (req: Request, res: Response) => {
    try {
        const sales = await getAllSales();
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: "Error fetching sales" });
    }
}

export const saleCreate = async (req: Request, res: Response) => {
    try {
        const sale = req.body;
        const newSale = await createSale(sale);
        res.status(201).json(newSale);
    } catch (error) {
        res.status(500).json({ error: "Error creating sale" });
    }
};
