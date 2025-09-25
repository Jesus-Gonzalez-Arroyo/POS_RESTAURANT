import { Router } from 'express'
import { fetchAllProducts } from '../controllers/products.controller'
import { authenticateToken } from '../middlewares/auth.middleware'

const router_products = Router()

router_products.get('/', authenticateToken, fetchAllProducts)

export default router_products
