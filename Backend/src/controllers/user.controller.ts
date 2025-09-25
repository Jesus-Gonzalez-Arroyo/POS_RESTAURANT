import { createUser, getAllUsers, deleteUser, updateUser } from "../services/user.service";
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
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Se produjo un error al registrar el usuario' });
    }
};

export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const user = await deleteUser(id);
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        res.json({ message: 'Usuario eliminado exitosamente', user });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Se produjo un error al eliminar el usuario' });
    }
};

export const updateUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const { name, user, password, rol } = req.body;
        const result = await updateUser(id, name, user, password, rol);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Se produjo un error al actualizar el usuario' });
    }
};