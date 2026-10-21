import { Router } from 'express';
import { 
  crearOportunidad, 
  getOportunidades, 
  getOportunidadesPorUsuario, 
  updateOportunidad, 
  agregarComentario 
} from '../controllers/oportunidad.js';
import validateToken from './validateToken.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.post('/', validateToken, crearOportunidad);
router.get('/', validateToken, getOportunidades);
router.get('/usuario/:idUsuario', validateToken, getOportunidadesPorUsuario);
router.put('/:id', validateToken, updateOportunidad);
// 📄 Permite recibir un archivo PDF bajo el campo 'archivo'
router.post('/:id/comentarios', validateToken, upload.single('archivo'), agregarComentario);

export default router;