import express, { type Application } from 'express';
import sequelize from '../database/connection.js';
import RUser from '../routes/user.js';
import { User } from './user.js';


class Server {

    private app: Application;
    private port: string;
    constructor() {
         
        this.app = express();
        this.port = process.env.PORT || '3016';   
        this.listen();
        this.midlewares();
        this.router();
        this.DBconnect();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

    router(){
        this.app.use(RUser)
    }

    midlewares(){
        this.app.use(express.json());
    }
    async DBconnect() {
        // Database connection logic here
        try {
            await User.sync();
            console.log('Se creo la tabla');
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
}

export default Server;