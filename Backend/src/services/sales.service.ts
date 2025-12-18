import pool from "../config/connectDB";
import { SaleCreate } from "../interfaces/sales.interfaces";

export const getAllSales = async () => {
    const res = await pool.query('SELECT * FROM sales');
    return res.rows;
}

export const createSale = async (sale: SaleCreate) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const { customer, total, paymentmethod, products, time } = sale;
        const ganancias = products.reduce((acc: number, product: any) => acc + (parseInt(product.earnings) * product.quantity), 0).toString();
        
        const res = await client.query(
            'INSERT INTO sales (customer, total, paymentmethod, products, time, ganancias) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [customer, total, paymentmethod, JSON.stringify(products), time, ganancias]
        );
        
        await descountStock(client, products);
        
        await client.query('COMMIT');
        
        return res.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en createSale:', error);
        throw new Error(`Error al crear la venta: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
        client.release();
    }
}

export const descountStock = async (client: any, products: { id: number; quantity: number }[]) => {
    try {
        for (const product of products) {
            const checkStock = await client.query(
                'SELECT stock FROM products WHERE id = $1',
                [product.id]
            );
            
            if (checkStock.rows.length === 0) {
                throw new Error(`Producto con ID ${product.id} no encontrado`);
            }
            
            const currentStock = checkStock.rows[0].stock;
            
            if (currentStock < product.quantity) {
                throw new Error(`Stock insuficiente para el producto ID ${product.id}. Disponible: ${currentStock}, Solicitado: ${product.quantity}`);
            }
            
            const res = await client.query(
                'UPDATE products SET stock = stock - $1 WHERE id = $2 RETURNING stock',
                [product.quantity, product.id]
            );
            
            if (res.rowCount === 0) {
                throw new Error(`No se pudo actualizar el stock del producto ID ${product.id}`);
            }
        }
    } catch (error) {
        console.error('Error en descountStock:', error);
        throw error;
    }
}

