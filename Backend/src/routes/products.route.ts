import { Router } from 'express'
import multer from 'multer'
import { fetchAllProducts, addNewProduct, updateProduct, deleteProduct } from '../controllers/products.controller'
import { authenticateToken } from '../middlewares/auth.middleware'

const router_products = Router()

// Configuración de multer para almacenar archivos en memoria
const storage = multer.memoryStorage()
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB límite
  },
  fileFilter: (req, file, cb) => {
    // Validar que sea una imagen
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten archivos de imagen'))
    }
  }
})

router_products.get('/', authenticateToken, fetchAllProducts)
router_products.post('/', authenticateToken, upload.single('img'), addNewProduct)
router_products.put('/:id', authenticateToken, upload.single('img'), updateProduct)
router_products.delete('/:id', authenticateToken, deleteProduct)

export default router_products
