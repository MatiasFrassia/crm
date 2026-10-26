import { Router } from 'express';
import { loginClienteGoogle, actualizarCliente, getClientes, crearClienteManual } from '../controllers/cliente.js';
import validateToken from './validateToken.js';

const router = Router();

router.post('/login-cliente-google', loginClienteGoogle);
router.put('/cliente/:id', validateToken, actualizarCliente); 
router.get('/clientes', validateToken, getClientes);
router.post('/cliente', validateToken, crearClienteManual); // 👈 Nueva ruta para crear clientes manualmente

export default router;