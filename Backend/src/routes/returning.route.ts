import { Router } from 'express'
import { handleProcessReturn, handleGetAllReturns } from '../controllers/returning.controller'
import { authenticateToken } from '../middlewares/auth.middleware'

const router_returning = Router()

router_returning.post('/', authenticateToken, handleProcessReturn)
router_returning.get('/', authenticateToken, handleGetAllReturns)

export default router_returning