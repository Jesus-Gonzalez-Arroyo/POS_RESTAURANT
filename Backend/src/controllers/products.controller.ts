import { getAllProducts } from '../services/products.service'
import { Request, Response } from 'express'

export const fetchAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await getAllProducts()
    res.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
