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

    return { status: 201, message: 'Usuario creado exitosamente', user: res_insert.rows[0] };
};

export const deleteUser = async (id: number) => {
    const res = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
};

export const updateUser = async (id: number, name: string, user: string, password: string, rol: string) => {
    const existingUser = await pool.query('SELECT * FROM usuarios WHERE usuario = $1 AND id != $2', [user, id]);        

    if (existingUser.rows.length > 0) {
        return { status: 400, message: 'El nombre de usuario ya está en uso' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const res_update = await pool.query(
        'UPDATE usuarios SET name = $1, usuario = $2, password = $3, rol = $4 WHERE id = $5 RETURNING *',
        [name, user, hashedPassword, rol, id]
    );

    return { status: 200, message: 'Usuario actualizado exitosamente', user: res_update.rows[0] };
};