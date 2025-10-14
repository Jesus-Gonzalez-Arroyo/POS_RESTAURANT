import { Router } from "express";
import {createOrder, deleteOrder, fetchAllOrders} from '../controllers/orders.controller'
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get('/', authenticateToken, fetchAllOrders);
router.post('/', authenticateToken, createOrder);
router.delete('/:id', authenticateToken, deleteOrder);

export default router;
