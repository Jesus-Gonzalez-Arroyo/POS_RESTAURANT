import { Router } from 'express'
import { registerUser, getUsersAll, deleteUserById, updateUserById } from '../controllers/user.controller'
import { authenticateToken } from '../middlewares/auth.middleware'

const router_users = Router()

router_users.get('/', authenticateToken, getUsersAll)
router_users.post('/create', authenticateToken, registerUser)
router_users.delete('/delete/:id', authenticateToken, deleteUserById)
router_users.put('/update/:id', authenticateToken, updateUserById)

export default router_users