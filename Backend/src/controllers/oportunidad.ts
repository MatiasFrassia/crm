import type { Request, Response } from 'express';
import { Oportunidad } from '../models/oportunidad.js';
import { ComentarioOportunidad } from '../models/comentario.js';
import { User } from '../models/user.js';
import { Cliente } from '../models/cliente.js';

const includeOportunidadCompleta = [
  { 
    model: Cliente, 
    as: 'datosCliente', // 👈 Coincide exactamente con el alias de tu modelo
    attributes: ['id_cliente', 'razon_social', 'cuit'] 
  },
  { 
    model: User, 
    as: 'usuarioAsignado', 
    attributes: ['id_usuario', 'nombre', 'apellido', 'email'] 
  },
  { 
    model: ComentarioOportunidad, 
    as: 'comentarios',
    include: [
      { 
        model: User, 
        as: 'usuario', 
        attributes: ['id_usuario', 'nombre', 'apellido', 'email'] 
      }
    ]
  }
];

export const crearOportunidad = async (req: Request, res: Response) => {
  const {
    titulo_oportunidad, id_usuario_asignado, id_cliente, marca, producto,
    fecha_cierre_estimado, operacion_monto_estimado, plazo_pago_proveedor,
    plazo_pago_cliente, observaciones
  } = req.body;

  try {
    const fechaActual = new Date().toISOString().split('T')[0];

    const nuevaOportunidad = await Oportunidad.create({
      titulo_oportunidad, id_usuario_asignado, id_cliente,
      marca: marca || null, producto: producto || null,
      fecha_inicio: fechaActual,
      fecha_cierre_estimado: fecha_cierre_estimado || null,
      operacion_monto_estimado: operacion_monto_estimado || null,
      avance_proyecto: 1, 
      plazo_pago_proveedor: plazo_pago_proveedor || null,
      plazo_pago_cliente: plazo_pago_cliente || null,
      observaciones: observaciones || null
    });

    return res.status(201).json(nuevaOportunidad);
  } catch (error) {
    console.error('Error al crear oportunidad:', error);
    return res.status(500).json({ msg: 'Error al guardar la oportunidad en la base de datos' });
  }
};

export const getOportunidades = async (req: Request, res: Response) => {
  try {
    const lista = await Oportunidad.findAll({
      include: includeOportunidadCompleta,
      order: [['updatedAt', 'DESC']]
    });
    return res.json(lista);
  } catch (error) {
    console.error('Error al obtener oportunidades:', error);
    return res.status(500).json({ msg: 'Error al consultar la base de datos' });
  }
};

export const getOportunidadesPorUsuario = async (req: Request, res: Response) => {
  const idUsuario = Number(req.params.idUsuario);
  if (isNaN(idUsuario)) return res.status(400).json({ msg: 'El ID de usuario provisto no es válido' });

  try {
    const lista = await Oportunidad.findAll({
      where: { id_usuario_asignado: idUsuario },
      include: includeOportunidadCompleta,
      order: [['updatedAt', 'DESC']]
    });
    return res.json(lista);
  } catch (error) {
    console.error('Error al obtener oportunidades del usuario:', error);
    return res.status(500).json({ msg: 'Error al consultar la base de datos' });
  }
};

export const updateOportunidad = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ msg: 'El ID provisto no es válido' });

  try {
    const oportunidad = await Oportunidad.findByPk(id);
    if (!oportunidad) return res.status(404).json({ msg: `No existe la oportunidad con id ${id}` });

    await oportunidad.update(req.body);
    return res.json(oportunidad);
  } catch (error) {
    console.error('Error al actualizar oportunidad:', error);
    return res.status(500).json({ msg: 'Error al actualizar la oportunidad' });
  }
};

export const agregarComentario = async (req: Request, res: Response) => {
  const idOportunidad = Number(req.params.id);
  const { texto, id_usuario } = req.body || {};
  const idUsuarioNum = Number(id_usuario);

  if (isNaN(idOportunidad)) return res.status(400).json({ msg: 'El ID de la oportunidad no es válido' });
  if (!id_usuario || id_usuario === 'undefined' || isNaN(idUsuarioNum) || idUsuarioNum <= 0) {
    return res.status(400).json({ msg: 'Se requiere un id_usuario válido' });
  }

  const nombreArchivoGuardado = req.file ? req.file.filename : null;

  try {
    const nuevoComentario = await ComentarioOportunidad.create({
      id_oportunidad: idOportunidad, id_usuario: idUsuarioNum,
      texto: texto || '', archivo_adjunto: nombreArchivoGuardado
    });

    const idComentario = nuevoComentario.get('id_comentario') as number;
    const comentarioConAutor = await ComentarioOportunidad.findByPk(idComentario, {
      include: [{ model: User, as: 'usuario', attributes: ['id_usuario', 'nombre', 'apellido', 'email'] }]
    });

    return res.status(201).json(comentarioConAutor || nuevoComentario);
  } catch (error) {
    console.error('Error al agregar comentario en MySQL:', error);
    return res.status(500).json({ msg: 'Error al registrar el comentario en la base de datos' });
  }
};