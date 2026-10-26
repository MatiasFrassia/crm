import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login-service';
import { ClienteService } from '../../services/cliente';

@Component({
  selector: 'app-perfil-cliente',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './perfil-cliente.html',
  styleUrl: './perfil-cliente.css'
})
export class PerfilClienteComponent implements OnInit {
  private loginService = inject(LoginService);
  private clienteService = inject(ClienteService);
  private toastr = inject(ToastrService);

  cliente: any = {};
  loading = false;

  ngOnInit() {
    // Cargamos los datos actuales del localStorage
    const usuarioActual = this.loginService.getUsuarioActual();
    if (usuarioActual) {
      this.cliente = { ...usuarioActual };
    }
  }

  guardarPerfil() {
    if (!this.cliente.telefono || !this.cliente.direccion || !this.cliente.cuit) {
      this.toastr.warning('Por favor complete Teléfono, Dirección y CUIT/CUIL', 'Campos obligatorios');
      return;
    }

    this.loading = true;

    this.clienteService.actualizarPerfil(this.cliente.id_cliente, this.cliente).subscribe({
      next: (res: any) => {
        // Actualizamos el localStorage con los nuevos datos para que el resto de la app los reconozca
        const clienteActualizado = { ...this.cliente, ...res.cliente, isCliente: true };
        localStorage.setItem('usuarioActual', JSON.stringify(clienteActualizado));
        
        this.toastr.success('Sus datos fueron actualizados', 'Perfil Guardado');
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudieron guardar los cambios', 'Error');
        this.loading = false;
      }
    });
  }
}