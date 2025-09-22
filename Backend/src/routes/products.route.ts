import { Router } from 'express'
import { fetchAllProducts } from '../controllers/products.controller'

const router_products = Router()

router_products.get('/', fetchAllProducts)

export default router_products
