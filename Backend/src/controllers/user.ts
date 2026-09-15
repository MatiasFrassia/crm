import type { Request, Response } from 'express';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const register = async (req: Request, res: Response) => {
    const { name, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    try{
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
        password: password
        }, process.env.SECRET_KEY || 'R9P9FTQGpcER•••••••••••••••••••cRwWrMYlsrXl', { expiresIn: '1h' });
   console.log('User logged in:', user.name, user.lastName);
   res.json({token: token});

    
}
   
