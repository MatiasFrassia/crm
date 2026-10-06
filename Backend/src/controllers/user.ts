import type { Request, Response } from 'express';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const register = async (req: Request, res: Response) => {
    const { nombre, apellido, email, password, isAdmin } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    
    
    try{
      const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
      await User.create({
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: passwordHash,
        isAdmin: isAdmin
     })

     res.json({
        message: `User ${nombre} ${apellido} registered successfully`
     });
    } catch(error){
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
}

export const login = async (req: Request, res: Response) => {
   const {email, password} = req.body;
   const user: any = await User.findOne({ where: { email: email } });
   if (!user) {
      return res.status(400).json({ message: 'User not found' });
   }

   const isPasswordValid = await bcrypt.compare(password, user.password);
   if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
   }

   const token = jwt.sign({ 
        email: email,
        password: password,
         isAdmin: user.isAdmin
        }, process.env.SECRET_KEY || 'R9P9FTQGpcER•••••••••••••••••••cRwWrMYlsrXl');
   console.log('User logged in:', user.nombre, user.apellido);
   res.json({token: token});

    
}
   
