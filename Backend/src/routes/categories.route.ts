import { Router } from 'express'
import { getAllCategories, createCategory, editCategory, removeCategory } from '../controllers/categories.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getAllCategories);
router.post('/', authenticateToken, createCategory);
router.put('/:id', authenticateToken, editCategory);
router.delete('/:id', authenticateToken, removeCategory);

export default router;
    