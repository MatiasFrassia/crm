import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnInit, 
  AfterViewInit, 
  OnDestroy,
  ViewChild, 
  ElementRef, 
  inject 
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { Usuario } from '../../clases/usuario';
import { OportunidadService } from '../../services/oportunidad';
import { UsuarioService } from '../../services/usuario-service';
import { LoginService } from '../../services/login-service';
import { CotizacionDolar } from '../cotizacion-dolar/cotizacion-dolar';
import { ChatService } from '../../services/chat-service';
import { InputMonedaDirective } from '../../directivas/input-moneda'; // 👈 1. Importación agregada
import { CalculadoraMargenDirective } from '../../directivas/calculadora-margen';

@Component({
  selector: 'app-oportunidad-component',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    CotizacionDolar,
    InputMonedaDirective,
    CalculadoraMargenDirective // 👈 2. Directiva registrada en los imports
  ],
  templateUrl: './oportunidad-component.html',
  styleUrl: './oportunidad-component.css',
})
export class OportunidadComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() oportunidad: any;
  @Output() cerrar = new EventEmitter<void>();

  @ViewChild('historialBody') private historialBodyContainer!: ElementRef;

  public esAdmin = false;
  public usuarios: Usuario[] = [];
  public nuevoComentario: string = '';
  public archivoSeleccionado: File | null = null;
  public loading: boolean = false;

  // ⚡ Variables de Firebase
  public mensajesChat: any[] = []; 
  private chatSub!: Subscription;

  private oportunidadServices = inject(OportunidadService);
  private usuarioService = inject(UsuarioService);
  private loginService = inject(LoginService);
  private toastr = inject(ToastrService);
  private chatService = inject(ChatService);

  ngOnInit(): void {
    this.esAdmin = this.loginService.getIsAdmin();

    if (this.esAdmin) {
      this.usuarioService.getAllUsuarios().subscribe({
        next: (data) => this.usuarios = data,
        error: (err) => console.error('Error al obtener usuarios:', err)
      });
    }

    if (this.oportunidad && !this.oportunidad.comentarios) {
      this.oportunidad.comentarios = [];
    }

    // ⚡ CONECTAR AL CHAT EN TIEMPO REAL CON FIREBASE
    const idOportunidad = this.oportunidad?.id_oportunidad || this.oportunidad?.id;
    if (idOportunidad) {
      this.chatSub = this.chatService.obtenerMensajes(Number(idOportunidad)).subscribe({
        next: (mensajes) => {
          // Ordenamos los mensajes cronológicamente
          this.mensajesChat = mensajes.sort((a, b) => a.createdAt - b.createdAt);
          setTimeout(() => this.scrollToBottom(), 100);
        },
        error: (err) => console.error('Error escuchando chat:', err)
      });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToBottom(), 100);
  }

  ngOnDestroy(): void {
    // Seguridad adicional: desconectar si el componente se destruye
    if (this.chatSub) {
      this.chatSub.unsubscribe();
    }
  }

  getURLArchivo(nombreArchivo: string): string {
    if (!nombreArchivo) return '#';
    return `http://localhost:3016/uploads/${nombreArchivo}`;
  }

  obtenerNombreAutor(comentario: any): string {
    if (!comentario) return 'Usuario';
    if (comentario.usuario && typeof comentario.usuario === 'object') {
      const nombre = comentario.usuario.nombre || '';
      const apellido = comentario.usuario.apellido || '';
      if (nombre || apellido) return `${nombre} ${apellido}`.trim();
    }
    if (typeof comentario.usuario === 'string' && comentario.usuario.trim()) {
      return comentario.usuario;
    }
    return 'Usuario';
  }

  private scrollToBottom(): void {
    try {
      if (this.historialBodyContainer) {
        this.historialBodyContainer.nativeElement.scrollTop = 
          this.historialBodyContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error en scroll:', err);
    }
  }

  cerrarModal(): void {
    // ⚡ Desconectar de Firebase para no consumir recursos en segundo plano
    if (this.chatSub) {
      this.chatSub.unsubscribe();
    }
    this.cerrar.emit();
  }

  guardar(): void {
    if (!this.oportunidad) return;
    const idOportunidad = this.oportunidad.id_oportunidad || this.oportunidad.id;

    if (!idOportunidad) {
      this.toastr.error('No se pudo identificar el ID de la oportunidad', 'Error');
      return;
    }

    this.loading = true;

    this.oportunidadServices.actualizarOportunidad(idOportunidad, this.oportunidad).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success(`Oportunidad #${idOportunidad} actualizada con éxito`, 'Éxito');
        this.cerrarModal();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al actualizar:', err);
        this.toastr.error('Ocurrió un error al guardar los cambios', 'Error');
      }
    });
  }

  onArchivoSeleccionado(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
        this.toastr.warning('Por favor seleccione un archivo PDF o una imagen', 'Formato no permitido');
        return;
      }
      this.archivoSeleccionado = file;
    }
  }

  quitarArchivo(): void {
    this.archivoSeleccionado = null;
  }

  /**
   * Envía el comentario a MySQL y luego lo sincroniza a Firebase
   */
  agregarComentario(): void {
    if ((!this.nuevoComentario || !this.nuevoComentario.trim()) && !this.archivoSeleccionado) {
      this.toastr.warning('Escriba un comentario o adjunte una cotización PDF', 'Atención');
      return;
    }

    const idOportunidad = Number(this.oportunidad?.id_oportunidad || this.oportunidad?.id);
    const usuarioActual = this.loginService.getUsuarioActual();
    const rawId = usuarioActual?.id_usuario ?? usuarioActual?.id;
    const idUsuarioActual = Number(rawId);

    if (!idOportunidad || isNaN(idOportunidad)) {
      this.toastr.error('No se encontró el ID de la oportunidad', 'Error');
      return;
    }

    if (!idUsuarioActual || isNaN(idUsuarioActual)) {
      this.toastr.error('No se pudo identificar al usuario en sesión. Cierre sesión e ingrese nuevamente.', 'Error');
      return;
    }

    const textoComentario = this.nuevoComentario ? this.nuevoComentario.trim() : '';
    
    this.loading = true; // Bloquea el botón (evita múltiples clicks)

    // 1️⃣ Guardar en Node.js (MySQL + Multer)
    this.oportunidadServices.agregarComentario(
      idOportunidad, 
      textoComentario, 
      idUsuarioActual, 
      this.archivoSeleccionado || undefined
    ).subscribe({
      next: async (comentarioGuardado: any) => {
        
        // 2️⃣ Node respondió OK. Sincronizamos a Firebase (Efecto WhatsApp)
        try {
          await this.chatService.sincronizarMensaje(idOportunidad, comentarioGuardado);
          
          this.toastr.success('Novedad registrada', 'Éxito');
          this.nuevoComentario = '';
          this.archivoSeleccionado = null;
          
          // No hacemos .push() local porque la suscripción a Firebase lo inyecta automáticamente.
        } catch (error) {
          console.error('Error al sincronizar con Firebase:', error);
          this.toastr.error('Se guardó, pero falló la actualización en vivo', 'Advertencia');
        } finally {
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error al agregar comentario:', err);
        this.toastr.error(err?.error?.msg || 'Error al registrar la novedad', 'Error');
        this.loading = false;
      }
    });
  }
}
