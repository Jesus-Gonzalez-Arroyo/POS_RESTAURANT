import { getAllProducts, insertProduct, productDelete, productUpdate } from '../services/products.service'
import e, { Request, Response } from 'express'

export const fetchAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await getAllProducts()
    res.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const addNewProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, earnings, category, availability } = req.body;
    const img = req.file ? req.file.buffer : undefined;
    const newProduct = await insertProduct(name, price, earnings, category, availability, img);
    res.status(201).json({ message: 'Producto agregado con exito', product: newProduct });
  } catch (error) {
    console.error('Error agregando producto:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price, earnings, category, availability } = req.body;
    const img = req.file ? req.file.buffer : undefined;
    const updatedProduct = await productUpdate(Number(id), name, price, earnings, category, availability, img);
    res.json({ message: 'Producto actualizado con exito', updatedProduct });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Internal server error', details: error });
  }
}

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await productDelete(Number(id));
    res.json({ message: 'Producto eliminado con exito' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}