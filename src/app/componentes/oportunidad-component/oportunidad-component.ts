import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnInit, 
  AfterViewInit, 
  ViewChild, 
  ElementRef, 
  inject 
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Usuario } from '../../clases/usuario';
import { OportunidadService } from '../../services/oportunidad';
import { UsuarioService } from '../../services/usuario-service';
import { LoginService } from '../../services/login-service';
import { CotizacionDolar } from '../cotizacion-dolar/cotizacion-dolar';

@Component({
  selector: 'app-oportunidad-component',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    CotizacionDolar
  ],
  templateUrl: './oportunidad-component.html',
  styleUrl: './oportunidad-component.css',
})
export class OportunidadComponent implements OnInit, AfterViewInit {

  @Input() oportunidad: any;
  @Output() cerrar = new EventEmitter<void>();

  @ViewChild('historialBody') private historialBodyContainer!: ElementRef;

  public esAdmin = false;
  public usuarios: Usuario[] = [];
  public nuevoComentario: string = '';
  public archivoSeleccionado: File | null = null;
  public loading: boolean = false;

  private oportunidadServices = inject(OportunidadService);
  private usuarioService = inject(UsuarioService);
  private loginService = inject(LoginService);
  private toastr = inject(ToastrService);

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
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToBottom(), 100);
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
      if (nombre || apellido) {
        return `${nombre} ${apellido}`.trim();
      }
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
   * Envía el comentario o la cotización PDF al servicio pasando los parámetros individuales
   */
  agregarComentario(): void {
    if ((!this.nuevoComentario || !this.nuevoComentario.trim()) && !this.archivoSeleccionado) {
      this.toastr.warning('Escriba un comentario o adjunte una cotización PDF', 'Atención');
      return;
    }

    const idOportunidad = Number(this.oportunidad?.id_oportunidad || this.oportunidad?.id);
    const usuarioActual = this.loginService.getUsuarioActual();

    // Extraemos id_usuario del usuario logueado
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

    // 👈 LLAMADA CORRECTA: Parámetros individuales
    this.oportunidadServices.agregarComentario(
      idOportunidad, 
      textoComentario, 
      idUsuarioActual, 
      this.archivoSeleccionado || undefined
    ).subscribe({
      next: (comentarioGuardado: any) => {
        this.toastr.success('Novedad/Cotización registrada', 'Éxito');

        if (!this.oportunidad.comentarios) {
          this.oportunidad.comentarios = [];
        }

        this.oportunidad.comentarios.push(comentarioGuardado);
        this.nuevoComentario = '';
        this.archivoSeleccionado = null;
        
        setTimeout(() => this.scrollToBottom(), 50);
      },
      error: (err) => {
        console.error('Error al agregar comentario:', err);
        this.toastr.error(err?.error?.msg || 'Error al registrar la novedad o subir el archivo', 'Error');
      }
    });
  }
}
