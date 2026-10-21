import express, { type Application } from 'express';
import cors from 'cors';
import sequelize from '../database/connection.js';

// Importación de Rutas
import RUser from '../routes/user.js';
import RProduct from '../routes/products.js';
import routesOportunidad from '../routes/oportunidad.js';

// Importación de Modelos para sincronización con MySQL
import { User } from './user.js';
import { Product } from './products.js';
import { Oportunidad } from './oportunidad.js';
import { ComentarioOportunidad } from './comentario.js';
import RDolar from '../routes/dolarApi.js';
import path from 'path/win32';

class Server {

    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3016';   
        this.midlewares();
        this.router();
        this.DBconnect();
        this.listen();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

    router() {
        // Rutas del usuario y productos
        this.app.use(RUser);
        this.app.use(RProduct);
        
        // Ruta para gestión de Oportunidades
        this.app.use('/oportunidades', routesOportunidad);
        this.app.use('/dolarApi', RDolar);
    }

    midlewares() {
        this.app.use(express.json());
        this.app.use(cors());
        // 📄 Habilitar acceso público a la carpeta uploads para ver/descargar los PDF
        this.app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
    }

    async DBconnect() {
        try {
            // Sincronización de todas las tablas con la base de datos MySQL
            await User.sync();
            await Product.sync();
            await Oportunidad.sync();
            await ComentarioOportunidad.sync();
            
            console.log('Tablas sincronizadas correctamente en MySQL');
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
}

export default Server;