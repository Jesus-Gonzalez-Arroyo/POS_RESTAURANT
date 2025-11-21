import {Router} from 'express'
import {getDashboardController} from '../controllers/dashboard.controller'
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router()
router.get('/', authenticateToken, getDashboardController);

export default router;