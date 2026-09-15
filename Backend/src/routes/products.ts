import { Router } from "express";
import { getProducts, registerProduct } from "../controllers/products.js";


const router = Router();

router.post('/product/register', registerProduct);
router.get('/product/getProducts', getProducts);

export default router;