import { Router } from 'express'
import { fetchAllCashRegisters, createCashRegister, fetchOpenCashRegister, updateCashRegisterController } from '../controllers/box.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, fetchAllCashRegisters);
router.get('/open', authenticateToken, fetchOpenCashRegister);
router.post('/', authenticateToken, createCashRegister);
router.put('/:id', authenticateToken, updateCashRegisterController);

export default router;
