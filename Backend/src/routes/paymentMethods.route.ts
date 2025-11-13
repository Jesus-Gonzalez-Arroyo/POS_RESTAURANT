import { Router } from 'express'
import { getAllPaymentMethods, createPaymentMethod, editPaymentMethod, removePaymentMethod } from '../controllers/paymentMethods.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getAllPaymentMethods);
router.post('/', authenticateToken, createPaymentMethod);
router.put('/:id', authenticateToken, editPaymentMethod);
router.delete('/:id', authenticateToken, removePaymentMethod);

export default router;
