import Server from './models/server.js';
import dotenv from 'dotenv';
dotenv.config();

console.log("Hello, TypeScript!");


const server = new Server();
server.listen();