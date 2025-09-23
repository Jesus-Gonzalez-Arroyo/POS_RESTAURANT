import { Router } from 'express'
import { registerUser, getUsersAll } from '../controllers/user.controller'

const router_users = Router()

router_users.get('/', getUsersAll)
router_users.post('/create', registerUser)

export default router_users