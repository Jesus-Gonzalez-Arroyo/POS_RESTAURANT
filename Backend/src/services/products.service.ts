import pool from '../config/connectDB'
import { Product } from '../interfaces/product.interfaces'

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await pool.query('SELECT * FROM products')
  return res.rows
}

export const getProductById = async (id: number): Promise<Product | null> => {
  const res = await pool.query('SELECT * FROM products WHERE id = $1', [id])
  return res.rows.length > 0 ? res.rows[0] : null
}

export const getProductByName = async (name: string): Promise<Product | null> => {
  const res = await pool.query('SELECT * FROM products WHERE LOWER(name) = LOWER($1)', [name])
  return res.rows.length > 0 ? res.rows[0] : null
}

export const insertProduct = async (name: Product['name'], price: Product['price'], earnings: Product['earnings'], category: Product['category'], availability: Product['availability'], img?: Buffer): Promise<any> => {
  const existingProduct = await getProductByName(name)
  if (existingProduct) {
    throw new Error(`Ya existe un producto con el nombre "${name}"`)
  }

  if (Number(price) < 0) {
    throw new Error('El precio no puede ser negativo')
  }
  if (Number(earnings) < 0) {
    throw new Error('Las ganancias no pueden ser negativas')
  }

  const res = await pool.query('INSERT INTO products(name, price, earnings, category, availability, img) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [name, price, earnings, category, availability, img || null])
  return res.rows[0]
}

export const productUpdate = async (id: Product['id'], name: Product['name'], price: Product['price'], earnings: Product['earnings'], category: Product['category'], availability: Product['availability'], img?: Buffer): Promise<any> => {
  const existingProduct = await getProductById(id)
  if (!existingProduct) {
    throw new Error(`Producto con ID ${id} no encontrado`)
  }

  if (Number(price) < 0) {
    throw new Error('El precio no puede ser negativo')
  }
  if (Number(earnings) < 0) {
    throw new Error('Las ganancias no pueden ser negativas')
  }

  // Si se proporciona una nueva imagen, actualizarla; si no, mantener la existente
  if (img !== undefined) {
    const res = await pool.query('UPDATE products SET name=$1, price=$2, earnings=$3, category=$4, availability=$5, img=$6 WHERE id=$7 RETURNING *', [name, price, earnings, category, availability, img, id])
    return res.rows[0]
  } else {
    const res = await pool.query('UPDATE products SET name=$1, price=$2, earnings=$3, category=$4, availability=$5 WHERE id=$6 RETURNING *', [name, price, earnings, category, availability, id])
    return res.rows[0]
  }
}

export const productDelete = async (id: number): Promise<any> => {
  const existingProduct = await getProductById(id)
  if (!existingProduct) {
    throw new Error(`Producto con ID ${id} no encontrado`)
  }

  const res = await pool.query('DELETE FROM products WHERE id=$1 RETURNING *', [id])
  return res.rows[0]
}