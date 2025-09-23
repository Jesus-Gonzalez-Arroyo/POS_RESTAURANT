import pool from "../config/connectDB";
import bcrypt from 'bcrypt';

export const getAllUsers = async () => {
    const res = await pool.query('SELECT * FROM usuarios');
    return res.rows;
}

export const createUser = async (name: string, user: string, password: string, rol: string) => {

    const existingUser = await pool.query('SELECT * FROM usuarios WHERE usuario = $1', [user]);

    if (existingUser.rows.length > 0) {
      return { status: 400, message: 'El nombre de usuario ya está en uso' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const res_insert = await pool.query(
        'INSERT INTO usuarios (name, usuario, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, user, hashedPassword, rol]
    );

    return { status: 201, message: 'Usuario creado exitosamente'};
};
