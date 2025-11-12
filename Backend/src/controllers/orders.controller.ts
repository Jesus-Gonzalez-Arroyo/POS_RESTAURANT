import { deleteOrderById, getAllOrders, saveOrder } from '../services/orders.service'
import { Request, Response } from 'express'

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const newOrder = req.body;
    const savedOrder = await saveOrder(newOrder);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await deleteOrderById(Number(id));
    res.status(200).json({ message: "Order deleted successfully", result });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
