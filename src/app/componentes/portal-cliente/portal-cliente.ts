import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login-service';
import { OportunidadService } from '../../services/oportunidad'; // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router';

@Component({
  selector: 'app-portal-cliente',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './portal-cliente.html',
  styleUrl: './portal-cliente.css'
})
export class PortalCliente implements OnInit {
  private loginService = inject(LoginService);
  private oportunidadService = inject(OportunidadService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  clienteActual: any;
  loading = false;

  // Formulario simplificado
  pedido = {
    titulo: '',
    marca: '',
    producto: '',
    observaciones: ''
  };

  ngOnInit() {
    this.clienteActual = this.loginService.getUsuarioActual();
  }

  enviarPedido() {
    // 🛑 NUEVO: Verificación estricta de perfil completo
    if (!this.clienteActual.cuit || !this.clienteActual.direccion || !this.clienteActual.telefono) {
      this.toastr.error('Debe completar sus datos de facturación y contacto antes de crear un pedido.', 'Perfil Incompleto');
      this.router.navigate(['/mi-perfil']);
      return;
    }

    if (!this.pedido.titulo.trim()) {
      this.toastr.warning('Debe ingresar al menos el título de lo que necesita', 'Campo requerido');
      return;
    }

    this.loading = true;

    // Estructuramos los datos para que el backend los acepte como una oportunidad
    const nuevaOportunidad = {
      titulo_oportunidad: this.pedido.titulo,
      id_cliente: this.clienteActual.id_cliente,
      id_usuario_asignado: 1, // 👈 Se auto-asigna al Admin Principal (ID 1)
      marca: this.pedido.marca,
      producto: this.pedido.producto,
      observaciones: this.pedido.observaciones,
      // Campos requeridos por tu BD que el cliente no llena
      fecha_inicio: new Date().toISOString().split('T')[0],
      avance_proyecto: 1 
    };

    this.oportunidadService.crearOportunidad(nuevaOportunidad).subscribe({
      next: () => {
        this.toastr.success('Su pedido fue enviado. Un representante se pondrá en contacto.', '¡Pedido enviado!');
        // Limpiamos el formulario
        this.pedido = { titulo: '', marca: '', producto: '', observaciones: '' };
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Hubo un problema al enviar su pedido', 'Error');
        this.loading = false;
      }
    });
  }
}