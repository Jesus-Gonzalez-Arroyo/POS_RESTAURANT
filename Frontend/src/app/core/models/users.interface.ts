export interface User {
    id: number;
    name: string;
    usuario: string;
    password: string;
    rol: string;
}

export interface createUser {
    name: string;
    user: string;
    password: string;
    rol: number;
}