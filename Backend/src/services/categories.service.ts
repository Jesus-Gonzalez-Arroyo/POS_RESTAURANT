import pool from "../config/connectDB";
import { Category } from "../interfaces/categorie.interface";

export const getCategories = async () => {
    const res = await pool.query('SELECT * FROM categories');
    return res.rows;
}

export const addCategory = async (category: Category) => {
    const { name, description, color, icon, is_active, created_at, updated_at } = category;
    const res = await pool.query(
        'INSERT INTO categories (name, description, color, icon, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name, description, color, icon, is_active, created_at, updated_at]
    );
    return res.rows[0];
}

export const deleteCategory = async (id: number) => {
    const res = await pool.query(
        'DELETE FROM categories WHERE id = $1 RETURNING *',
        [id]
    );
    return res.rows[0];
}

export const updateCategory = async (id: number, category: Category) => {
    const { name, description, color, icon, is_active, created_at, updated_at } = category;
    const res = await pool.query(
        'UPDATE categories SET name = $1, description = $2, color = $3, icon = $4, is_active = $5, created_at = $6, updated_at = $7 WHERE id = $8 RETURNING *',
        [name, description, color, icon, is_active, created_at, updated_at, id]
    );
    return res.rows[0];
}

export const updateStateCategory = async (id: number, isActive: boolean, updatedAt: Date) => {
    const res = await pool.query(
        'UPDATE categories SET is_active = $1, updated_at = $2 WHERE id = $3 RETURNING *',
        [isActive, updatedAt, id]
    );
    return res.rows[0];
}