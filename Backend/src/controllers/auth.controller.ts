import { loginUser } from "../services/auth.service";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user, password } = req.body;
        const result = await loginUser(user, password);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'No se pudo iniciar sesión, intente de nuevo' });
    }
};
