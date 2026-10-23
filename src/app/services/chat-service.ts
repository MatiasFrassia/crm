import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// ⚡ Importamos TODO directamente del SDK nativo de Firebase, NO de @angular/fire
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private db;

  constructor() {
    // Inicializamos la app de Firebase de forma nativa e independiente de Angular
    const app = getApps().length === 0 ? initializeApp(environment.firebase) : getApp();
    this.db = getFirestore(app);
  }

  /**
   * 🎧 Escucha los mensajes en TIEMPO REAL usando onSnapshot nativo
   */
  obtenerMensajes(idOportunidad: number): Observable<any[]> {
    return new Observable((observer) => {
      const mensajesRef = collection(this.db, `oportunidades/${idOportunidad}/mensajes`);
      const q = query(mensajesRef, orderBy('createdAt', 'asc'));
      
      // onSnapshot es la función nativa de Firebase para tiempo real
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const mensajes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        observer.next(mensajes); // Enviamos los datos al componente
      }, (error) => {
        console.error('Error en Firebase nativo:', error);
        observer.error(error);
      });

      // Cuando el componente se destruye (se cierra el modal), ejecutamos la limpieza
      return () => unsubscribe(); 
    });
  }

  /**
   * 📤 Sincroniza un comentario hacia Firebase
   */
  async sincronizarMensaje(idOportunidad: number, comentarioMySQL: any) {
    const idUnico = comentarioMySQL.id_comentario ? String(comentarioMySQL.id_comentario) : String(new Date().getTime());
    const msjRef = doc(this.db, `oportunidades/${idOportunidad}/mensajes/${idUnico}`);
    
    await setDoc(msjRef, {
      id_comentario: comentarioMySQL.id_comentario || null,
      texto: comentarioMySQL.texto || '',
      archivo_adjunto: comentarioMySQL.archivo_adjunto || null,
      createdAt: new Date().getTime(),
      usuario: {
        nombre: comentarioMySQL.usuario?.nombre || 'Usuario',
        apellido: comentarioMySQL.usuario?.apellido || ''
      }
    });
  }
}