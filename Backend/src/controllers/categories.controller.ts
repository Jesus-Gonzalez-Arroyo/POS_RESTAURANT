import { Request, Response } from 'express'
import { getCategories, addCategory, updateCategory, deleteCategory } from '../services/categories.service';

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await getCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
}

export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const newCategory = req.body;
        const createdCategory = await addCategory(newCategory);
        res.status(201).json(createdCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create category' });
    }
}

export const editCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoryId = parseInt(req.params.id, 10);
        const updatedCategory = await updateCategory(categoryId, req.body);
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
}

export const removeCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoryId = parseInt(req.params.id, 10);
        await deleteCategory(categoryId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
}