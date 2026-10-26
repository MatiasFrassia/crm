import type { Request, Response } from 'express';
import { Cliente } from '../models/cliente.js';
import jwt from 'jsonwebtoken';

export const loginClienteGoogle = async (req: Request, res: Response): Promise<void> => {
    const { email, nombre, uid, telefono } = req.body;

    try {
        let cliente: any = await Cliente.findOne({ where: { email } });

        if (!cliente) {
            cliente = await Cliente.create({
                razon_social: nombre || 'Sin nombre',
                email: email,
                uid_firebase: uid,
                telefono: telefono || null,
                estado: true
            });
        } else {
            if (!cliente.uid_firebase) {
                await cliente.update({ uid_firebase: uid });
            }
        }

        const secretKey = process.env.SECRET_KEY || 'R9P9FTQGpcER•••••••••••••••••••cRwWrMYlsrXl';
        
        const token = jwt.sign(
            {
                email: cliente.email,
                id_cliente: cliente.id_cliente,
                isCliente: true 
            },
            secretKey,
            { expiresIn: '24h' }
        );

        res.json({ token, cliente: cliente });

    } catch (error) {
        console.error('Error en login de cliente con Google:', error);
        res.status(500).json({ msg: 'Error interno del servidor al procesar el login de Google', error });
    }
};

export const actualizarCliente = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { razon_social, cuit, direccion, telefono } = req.body;
    const clienteId = Number(id);

    if (isNaN(clienteId)) {
        res.status(400).json({ msg: 'El ID provisto no es un número válido' });
        return;
    }

    try {
        const cliente: any = await Cliente.findByPk(clienteId);
        
        if (!cliente) {
            res.status(404).json({ msg: 'Cliente no encontrado' });
            return;
        }

        await cliente.update({
            razon_social: razon_social || cliente.getDataValue('razon_social'),
            cuit: cuit || cliente.getDataValue('cuit'),
            direccion: direccion || cliente.getDataValue('direccion'),
            telefono: telefono || cliente.getDataValue('telefono')
        });

        res.json({ msg: 'Perfil actualizado correctamente', cliente });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ msg: 'Error interno al actualizar el perfil', error });
    }
};


export const getClientes = async (req: Request, res: Response): Promise<void> => {
    try {
        const clientes = await Cliente.findAll({
            
            attributes: ['id_cliente', 'razon_social', 'cuit', 'email', 'telefono', 'direccion', 'estado']
        });
        res.json(clientes);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ msg: 'Error al obtener la lista de clientes' });
    }
};

export const crearClienteManual = async (req: Request, res: Response): Promise<void> => {
    const { razon_social, email, cuit, telefono, direccion } = req.body;

    if (!razon_social || !email) {
        res.status(400).json({ msg: 'La Razón Social y el Email son obligatorios' });
        return;
    }

    try {
        const existe = await Cliente.findOne({ where: { email } });
        if (existe) {
            res.status(400).json({ msg: 'Ya existe un cliente con ese email' });
            return;
        }

        const nuevoCliente = await Cliente.create({
            razon_social,
            email,
            cuit: cuit || null,
            telefono: telefono || null,
            direccion: direccion || null,
            estado: true
        });

        res.status(201).json(nuevoCliente);
    } catch (error) {
        console.error('Error al crear cliente manual:', error);
        res.status(500).json({ msg: 'Error interno al crear el cliente' });
    }
};

