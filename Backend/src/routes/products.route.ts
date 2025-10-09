import { Router } from 'express'
import { fetchAllProducts, addNewProduct, updateProduct, deleteProduct } from '../controllers/products.controller'
import { authenticateToken } from '../middlewares/auth.middleware'

const router_products = Router()

router_products.get('/', authenticateToken, fetchAllProducts)
router_products.post('/', authenticateToken, addNewProduct)
router_products.put('/:id', authenticateToken, updateProduct)
router_products.delete('/:id', authenticateToken, deleteProduct)

export default router_products
