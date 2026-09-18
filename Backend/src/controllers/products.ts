import type { Request, Response } from 'express';
import { Product } from '../models/products.js';
import jwt from 'jsonwebtoken';


export const registerProduct = async (req: Request, res: Response) => {
    const { name, description, precio, stock, marca } = req.body;
    

    Product.create({ 
        name: name,
        description: description,
        precio: precio,
        stock: stock,
        marca: marca,
        status: 1
     })

    

     res.json({
        message: `Product ${name} ${marca} registered successfully`
     });
}

export const getProducts = async (req: Request, res: Response) => {
    const products = await Product.findAll();
    
    res.json(products);
}