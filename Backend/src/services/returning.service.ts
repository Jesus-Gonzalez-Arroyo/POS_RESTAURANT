import pool from "../config/connectDB";
import { ReturnData, ReturnProduct } from "../interfaces/returning.interface";

/**
 * Restaura el stock de productos devueltos
 * @param client - Cliente de conexión a la base de datos
 * @param products - Array de productos con id y cantidad a restaurar
 */
export const restoreStock = async (client: any, products: ReturnProduct[]) => {
    for (const product of products) {
        const checkProduct = await client.query(
            'SELECT id, stock FROM products WHERE id = $1',
            [product.id]
        );
        
        if (checkProduct.rows.length === 0) {
            throw new Error(`Producto con ID ${product.id} no encontrado`);
        }
        
        const res = await client.query(
            'UPDATE products SET stock = stock + $1 WHERE id = $2 RETURNING stock',
            [product.quantity, product.id]
        );
 
        if (res.rowCount === 0) {
            throw new Error(`No se pudo restaurar el stock del producto ID ${product.id}`);
        }
    }
}

/**
 * Procesa una devolución completa
 * @param returnData - Datos de la devolución
 */
export const processReturn = async (returnData: ReturnData) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const { saleId, customer, products, total, reason } = returnData;

        const saleResult = await client.query(
            'SELECT * FROM sales WHERE id = $1',
            [saleId]
        );
        
        if (saleResult.rows.length === 0) {
            throw new Error(`Venta con ID ${saleId} no encontrada`);
        }
        
        const originalSale = saleResult.rows[0];
        const originalProducts = typeof originalSale.products === 'string' 
            ? JSON.parse(originalSale.products) 
            : originalSale.products;

        const returnedEarnings = products.reduce((acc, product) => {
            const originalProduct = originalProducts.find((p: any) => p.name === product.name);
            if (originalProduct) {
                return acc + (parseInt(originalProduct.earnings || 0) * product.quantity);
            }
            return acc;
        }, 0);

        const updatedProducts = originalProducts.map((originalProduct: any) => {
            const returnedProduct = products.find(p => p.name === originalProduct.name);
            
            if (returnedProduct) {
                const newQuantity = originalProduct.quantity - returnedProduct.quantity;
                
                if (newQuantity <= 0) {
                    return null;
                }
                
                return {
                    ...originalProduct,
                    quantity: newQuantity,
                    total: originalProduct.price * newQuantity
                };
            }
            
            return originalProduct;
        }).filter((p: any) => p !== null);
        
        const newTotal = parseFloat(originalSale.total) - total;
        const newGanancias = parseFloat(originalSale.ganancias) - returnedEarnings;
        
        // Verificar si se devolvieron todos los productos
        if (updatedProducts.length === 0) {
            await client.query(
                'DELETE FROM sales WHERE id = $1',
                [saleId]
            );
            
            console.log(`Venta ID ${saleId} eliminada completamente - Todos los productos fueron devueltos`);
        } else {
            await client.query(
                `UPDATE sales 
                 SET products = $1, total = $2, ganancias = $3
                 WHERE id = $4`,
                [JSON.stringify(updatedProducts), newTotal.toString(), newGanancias.toString(), saleId]
            );
            
            console.log(`Venta ID ${saleId} actualizada - Productos restantes: ${updatedProducts.length}`);
        }
        
        // Registrar la devolución en la base de datos (tabla returns)
        const res = await client.query(
            `INSERT INTO returns (sale_id, customer, products, total, reason, date) 
             VALUES ($1, $2, $3, $4, $5, timezone('America/Bogota', NOW())) 
             RETURNING *`,
            [saleId, customer, JSON.stringify(products), total, reason]
        );
        
        // Restaurar el stock de los productos devueltos
        await restoreStock(client, products);
        
        await client.query('COMMIT');
        
        return {
            success: true,
            message: updatedProducts.length === 0 
                ? 'Devolución procesada exitosamente. Venta eliminada completamente.' 
                : 'Devolución procesada exitosamente',
            return: res.rows[0],
            saleDeleted: updatedProducts.length === 0,
            updatedSale: updatedProducts.length > 0 ? {
                newTotal: newTotal,
                newGanancias: newGanancias,
                remainingProducts: updatedProducts.length
            } : null
        };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en processReturn:', error);
        throw new Error(`Error al procesar la devolución: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
        client.release();
    }
}

/**
 * Obtener todas las devoluciones
 */
export const getAllReturns = async () => {
    const res = await pool.query('SELECT * FROM returns ORDER BY date DESC');
    return res.rows;
}

