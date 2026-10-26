import type { Request, Response } from 'express';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const register = async (req: Request, res: Response) => {
    const { nombre, apellido, email, password, isAdmin } = req.body;

    if (
      !nombre?.trim() || 
      !apellido?.trim() || 
      !email?.trim() || 
      !password?.trim()
    ) {
        return res.status(400).json({ 
            message: 'Todos los campos son obligatorios y no pueden estar vacíos' 
        });
    }

    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await User.create({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            email: email.trim(),
            password: passwordHash,
            isAdmin: isAdmin ?? false
        });

        res.json({
            message: `Usuario ${nombre} ${apellido} registrado correctamente`
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno al registrar el usuario' });
    }
};

/**
 * Autenticación e inicio de sesión
 */
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user: any = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Token JWT (sin exponer la contraseña en el payload)
        const token = jwt.sign(
            { 
                id: user.id_usuario || user.id,
                email: user.email,
                isAdmin: user.isAdmin
            }, 
            process.env.SECRET_KEY || 'R9P9FTQGpcER•••••••••••••••••••cRwWrMYlsrXl',
            { expiresIn: '8h' }
        );

        console.log('Usuario logueado:', user.nombre, user.apellido);
        
        // Retornamos el token y el perfil de usuario para Angular
        res.json({
            token,
            usuario: {
                id_usuario: user.id_usuario || user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                isAdmin: Boolean(user.isAdmin)
            }
        });
    } catch (error) {
        console.error('Error en el proceso de login:', error);
        res.status(500).json({ message: 'Error interno en el servidor' });
    }
};

/**
 * Obtener todos los usuarios de la base de datos MySQL
 */
export const getAllUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await User.findAll({
            attributes: { exclude: ['password'] } // Por seguridad no enviamos los hashes al frontend
        });
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
    }
};

/**
 * Actualizar información de un usuario por su ID
 */
export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, apellido, email, password, isAdmin } = req.body;

    const userId = Number(id);

    if (isNaN(userId)) {
        return res.status(400).json({ message: 'El ID provisto no es un número válido' });
    }

    try {
        const user: any = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: `No existe un usuario con el ID ${id}` });
        }

        // Si desde el formulario de Angular enviaron una nueva contraseña la encriptamos;
        // si la dejaron en blanco, conservamos la contraseña que ya tenía en la base de datos.
        let updatedPassword = user.password;
        if (password && password.trim() !== '') {
            updatedPassword = await bcrypt.hash(password, 10);
        }

        await user.update({
            nombre: nombre ? nombre.trim() : user.nombre,
            apellido: apellido ? apellido.trim() : user.apellido,
            email: email ? email.trim() : user.email,
            password: updatedPassword,
            isAdmin: isAdmin !== undefined ? isAdmin : user.isAdmin
        });

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error interno al actualizar el usuario' });
    }
};

/**
 * Eliminar un usuario físicamente de la base de datos por su ID
 */
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const userId = Number(id);

    if (isNaN(userId)) {
        return res.status(400).json({ message: 'El ID provisto no es un número válido' });
    }

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: `No existe un usuario con el ID ${id}` });
        }

        await user.destroy();

        res.json({ message: 'Usuario eliminado correctamente de la base de datos' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error interno al eliminar el usuario' });
    }
};
   
