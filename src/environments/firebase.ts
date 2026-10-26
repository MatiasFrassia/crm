import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { environment } from './environment'; // 👈 Importamos tus credenciales

// Inicializamos Firebase usando el objeto que ya tienes en environment.ts
const app = initializeApp(environment.firebase);

// Exportamos los servicios para usarlos en el resto de la app
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();