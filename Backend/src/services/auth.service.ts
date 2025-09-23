import pool from "../config/connectDB";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

export const loginUser = async (user: string, password: string) => {
    const res = await pool.query('SELECT * FROM usuarios WHERE usuario = $1', [user]);
    if (res.rows.length === 0) {
        return { status: 404, message: 'Usuario no encontrado' };
    }

    const userFound = res.rows[0];
    const passwordMatch = await bcrypt.compare(password, userFound.password);

    if (!passwordMatch) {
        return { status: 401, message: 'Contraseña incorrecta' };
    }

    const token = jwt.sign(
        { id: userFound.id },
        process.env.JWT_SECRET as string
    );

    return { status: 200, message: 'Inicio de sesión exitoso', token };
}