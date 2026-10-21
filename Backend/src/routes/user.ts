import { Router } from "express";
import { login, register, getAllUsuarios, updateUser, deleteUser } from "../controllers/user.js";
import validateToken from "./validateToken.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getAllUsuarios', validateToken, getAllUsuarios);
router.put('/updateUser/:id', validateToken, updateUser);
router.delete('/deleteUser/:id', validateToken, deleteUser);

export default router;