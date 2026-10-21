import { Router } from 'express';
import { getCotizacionDolar } from '../controllers/dolarApi.js';

const router = Router();

router.get('/', getCotizacionDolar);

export default router;