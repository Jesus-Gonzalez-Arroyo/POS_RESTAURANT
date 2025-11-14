import { Router } from 'express'
import { getAllPaymentMethods, createPaymentMethod, editPaymentMethod, removePaymentMethod, togglePaymentMethodState } from '../controllers/paymentMethods.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getAllPaymentMethods);
router.post('/', authenticateToken, createPaymentMethod);
router.put('/:id', authenticateToken, editPaymentMethod);
router.delete('/:id', authenticateToken, removePaymentMethod);
router.patch('/:id', authenticateToken, togglePaymentMethodState);

export default router;
