import type { Request, Response } from 'express';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';


export const register = async (req: Request, res: Response) => {
    const { name, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    User.create({ 
        name: name,
        lastName: lastName,
        email: email,
        password: passwordHash,
        status: 1
     })

     res.json({
        message: `User ${name} ${lastName} registered successfully`
     });
}