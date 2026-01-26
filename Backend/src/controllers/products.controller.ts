import { getAllProducts, insertProduct, productDelete, productUpdate } from '../services/products.service'
import e, { Request, Response } from 'express'

export const fetchAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : undefined
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined
    
    const result = await getAllProducts(page, limit)
    res.json(result)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const addNewProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, earnings, category, availability, stock, stay, id_product, price_sales } = req.body;
    const img = req.file ? req.file.buffer : undefined;
    const newProduct = await insertProduct(name, price, earnings, category, availability, stock || 0, img, stay, id_product, price_sales);
    res.status(201).json({ message: 'Producto agregado con exito', product: newProduct });
  } catch (error) {
    console.error('Error agregando producto:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price, earnings, category, availability, stock, stay, id_product, price_sales } = req.body;
    const img = req.file ? req.file.buffer : undefined;
    const updatedProduct = await productUpdate(id, name, price, earnings, category, availability, stock || 0, id_product, price_sales, img, stay);
    res.json({ message: 'Producto actualizado con exito', updatedProduct });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Internal server error', details: error });
  }
}

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await productDelete(id);
    res.json({ message: 'Producto eliminado con exito' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}