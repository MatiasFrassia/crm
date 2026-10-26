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
import { Cliente } from './cliente.js'; 
import { Oportunidad } from './oportunidad.js';
import { ComentarioOportunidad } from './comentario.js';
import RDolar from '../routes/dolarApi.js';
import path from 'path/win32';
import RCliente from '../routes/cliente.js';

class Server {

    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3016';   
        this.midlewares();
        this.router();
        this.DBconnect();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

    router() {
        this.app.use(RUser);
        this.app.use(RProduct);
        this.app.use('/oportunidades', routesOportunidad);
        this.app.use('/dolarApi', RDolar);
        this.app.use(RCliente);
    }

    midlewares() {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
    }

    async DBconnect() {
        try {
            // Sincronización normal y segura sin borrar el historial
            await User.sync({ alter: true });
            await Product.sync({ alter: true });
            await Cliente.sync({ alter: true });
            await Oportunidad.sync({ alter: true });
            await ComentarioOportunidad.sync({ alter: true });
            
            console.log('Tablas sincronizadas correctamente en MySQL');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
}

export default Server;