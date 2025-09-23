import { createUser, getAllUsers } from "../services/user.service";
import { Request, Response } from "express";

export const getUsersAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Se produjo un error al obtener los usuarios' });
    }
}

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, user, password, rol } = req.body;
        const result = await createUser(name, user, password, rol);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Se produjo un error al registrar el usuario' });
    }
};
