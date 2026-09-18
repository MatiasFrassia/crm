import { Router } from "express";
import { getProducts, registerProduct } from "../controllers/products.js";
import validateToken from "./validateToken.js";


const router = Router();

router.post('/product/register', registerProduct);
router.get('/product/getProducts',validateToken, getProducts);

export default router;