import { Router } from 'express'
import { login } from '../controllers/auth.controller'

const router_auth = Router()

router_auth.post('/login', login)

export default router_auth
