import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from '../../services/cliente';

@Component({
  selector: 'app-cartera-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cartera-clientes.html',
  styleUrl: './cartera-clientes.css'
})
export class CarteraClientesComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private toastr = inject(ToastrService);

  clientes: any[] = [];
  mostrarFormulario = false;
  loading = false;

  nuevoCliente = {
    razon_social: '',
    email: '',
    cuit: '',
    telefono: '',
    direccion: ''
  };

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => this.clientes = data,
      error: () => this.toastr.error('Error al cargar la cartera de clientes')
    });
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.resetForm();
    }
  }

  guardarCliente() {
    if (!this.nuevoCliente.razon_social.trim() || !this.nuevoCliente.email.trim()) {
      this.toastr.warning('Razón Social y Email son obligatorios');
      return;
    }

    this.loading = true;
    this.clienteService.crearCliente(this.nuevoCliente).subscribe({
      next: (res) => {
        this.toastr.success('Cliente registrado con éxito');
        this.clientes.unshift(res); // Agrega a la lista sin recargar
        this.toggleFormulario();
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.error?.msg || 'Error al guardar el cliente');
        this.loading = false;
      }
    });
  }

  resetForm() {
    this.nuevoCliente = { razon_social: '', email: '', cuit: '', telefono: '', direccion: '' };
  }
}