import pool from '../config/connectDB'
import { Product } from '../interfaces/product.interfaces'

export const getAllProducts = async (page?: number, limit?: number): Promise<{ products: Product[], total: number, page: number, totalPages: number }> => {
  // Si no se proporciona paginación, devolver todos los productos
  if (!page || !limit) {
    const res = await pool.query('SELECT * FROM products ORDER BY id DESC')
    return {
      products: res.rows,
      total: res.rows.length,
      page: 1,
      totalPages: 1
    }
  }

  // Calcular el offset
  const offset = (page - 1) * limit
  
  // Obtener el total de productos
  const countRes = await pool.query('SELECT COUNT(*) FROM products')
  const total = parseInt(countRes.rows[0].count)
  
  // Obtener los productos paginados
  const res = await pool.query('SELECT * FROM products ORDER BY id DESC LIMIT $1 OFFSET $2', [limit, offset])
  
  return {
    products: res.rows,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}

export const getProductById = async (id: string): Promise<Product | null> => {
  const res = await pool.query('SELECT * FROM products WHERE id_product = $1', [id])
  return res.rows.length > 0 ? res.rows[0] : null
}

export const insertProduct = async (name: Product['name'], price: Product['price'], earnings: Product['earnings'], category: Product['category'], availability: Product['availability'], stock: Product['stock'], img?: Buffer, stay?: Product['stay'], id_product?: Product['id_product'], price_sales?: Product['price_sales']): Promise<any> => {
  if (Number(price) < 0) {
    throw new Error('El precio no puede ser negativo')
  }
  if (Number(earnings) < 0) {
    throw new Error('Las ganancias no pueden ser negativas')
  }
  if (Number(stock) < 0) {
    throw new Error('El stock no puede ser negativo')
  }

  const res = await pool.query('INSERT INTO products(name, price, earnings, category, availability, stock, img, stay, id_product, price_sales) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', [name, price, earnings, category, availability, stock, img || null, stay, id_product, price_sales ])
  return res.rows[0]
}

export const productUpdate = async (id: Product['id'], name: Product['name'], price: Product['price'], earnings: Product['earnings'], category: Product['category'], availability: Product['availability'], stock: Product['stock'], id_product: Product['id_product'], price_sales: Product['price_sales'], img?: Buffer, stay?: Product['stay']): Promise<any> => {
  const existingProduct = await getProductById(id_product)
  if (!existingProduct) {
    throw new Error(`Producto con ID ${id} no encontrado`)
  }

  if (Number(price) < 0) {
    throw new Error('El precio no puede ser negativo')
  }
  if (Number(earnings) < 0) {
    throw new Error('Las ganancias no pueden ser negativas')
  }
  if (Number(stock) < 0) {
    throw new Error('El stock no puede ser negativo')
  }

  // Si se proporciona una nueva imagen, actualizarla; si no, mantener la existente
  if (img !== undefined) {
    const res = await pool.query('UPDATE products SET name=$1, price=$2, earnings=$3, category=$4, availability=$5, stock=$6, img=$7, stay=$8, id_product=$9, price_sales=$10 WHERE id_product=$9 RETURNING *', [name, price, earnings, category, availability, stock, img, stay, id_product, price_sales])
    return res.rows[0]
  } else {
    const res = await pool.query('UPDATE products SET name=$1, price=$2, earnings=$3, category=$4, availability=$5, stock=$6, stay=$7, id_product=$8, price_sales=$9 WHERE id_product=$8 RETURNING *', [name, price, earnings, category, availability, stock, stay, id_product, price_sales])
    return res.rows[0]
  }
}

export const productDelete = async (id_product: string): Promise<any> => {
  const existingProduct = await getProductById(id_product)
  if (!existingProduct) {
    throw new Error(`Producto con ID ${id_product} no encontrado`)
  }

  const res = await pool.query('DELETE FROM products WHERE id_product=$1 RETURNING *', [id_product])
  return res.rows[0]
}