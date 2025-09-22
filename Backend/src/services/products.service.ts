import pool from '../config/connectDB'

interface User {
  Id: number;
  name: string;
}

export const getAllProducts = async (): Promise<User[]> => {
  const res = await pool.query('SELECT * FROM products')
  return res.rows
}
