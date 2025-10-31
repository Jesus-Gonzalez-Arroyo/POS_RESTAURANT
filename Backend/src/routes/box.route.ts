import { Router } from 'express'
import { fetchAllCashRegisters, createCashRegister } from '../controllers/box.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, fetchAllCashRegisters);
router.post('/', authenticateToken, createCashRegister);

export default router;
