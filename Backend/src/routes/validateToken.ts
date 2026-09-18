import type { NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const headerToken = req.headers['authorization'];
    console.log(headerToken);

    if (headerToken != undefined && headerToken.startsWith('Bearer ')) {
        try {
            const token = headerToken.slice(7);
            jwt.verify(token, process.env.SECRET_KEY || 'R9P9FTQGpcER•••••••••••••••••••cRwWrMYlsrXl')
            console.log('Token validated successfully');
            next();
        }catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ message: 'Token not provided' });
    }
        
       
}

export default validateToken;