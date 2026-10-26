import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Usuario } from '../../clases/usuario';
import { OportunidadService } from '../../services/oportunidad';
import { LoginService } from '../../services/login-service';
import { UsuarioService } from '../../services/usuario-service';
import { CotizacionDolar } from '../cotizacion-dolar/cotizacion-dolar';

import { InputMonedaDirective } from '../../directivas/input-moneda';
import { CalculadoraMargenDirective } from '../../directivas/calculadora-margen';
import { ClienteService } from '../../services/cliente';

@Component({
  selector: 'app-nueva-oportunidad',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CotizacionDolar,
    InputMonedaDirective,
    CalculadoraMargenDirective
  ],
  templateUrl: './nueva-oportunidad.html',
  styleUrl: './nueva-oportunidad.css',
})
export class NuevaOportunidad implements OnInit {

  public esAdmin = false;
  public usuarios: Usuario[] = [];
  public usuariosFiltrados: Usuario[] = [];
  public filtroUsuario: string = '';
  public mostrarListaUsuarios = false;
  public loading = false;
  
  // Variables para el buscador dinámico de clientes
  public clientes: any[] = [];
  public clientesFiltrados: any[] = []; 
  public filtroCliente: string = '';    
  public mostrarListaClientes = false;  

  form: any = {
    titulo: '',
    usuario: null,
    cliente: '',
    marca: '',
    producto: '',
    fechaCierreEstimado: '',
    monto: null,
    precioVenta: null,
    margen_ganancia: 10,
    plazoProveedor: '',
    plazoCliente: '',
    observaciones: ''
  };

  private clienteService = inject(ClienteService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private oportunidadService = inject(OportunidadService);
  private loginService = inject(LoginService);
  private usuarioService = inject(UsuarioService);

  ngOnInit(): void {
    this.esAdmin = this.loginService.getIsAdmin();

    if (this.esAdmin) {
      this.cargarUsuarios();
    }
    
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.clientesFiltrados = data; // Inicializamos la lista filtrada
      },
      error: (err) => console.error('Error al obtener clientes', err)
    });
  }

  cargarUsuarios(): void {
    this.usuarioService.getAllUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
        this.toastr.error('No se pudieron cargar los usuarios de la base de datos', 'Error');
      }
    });
  }

  onBuscarUsuario(): void {
    const texto = this.filtroUsuario.toLowerCase().trim();
    if (!texto) {
      this.usuariosFiltrados = this.usuarios;
    } else {
      this.usuariosFiltrados = this.usuarios.filter(u => {
        const nombre = (u.nombre || '').toLowerCase();
        const apellido = (u.apellido || '').toLowerCase();
        return nombre.includes(texto) || apellido.includes(texto);
      });
    }
    this.mostrarListaUsuarios = true;
  }

  seleccionarUsuario(usuario: Usuario): void {
    this.form.usuario = usuario;
    this.filtroUsuario = `${usuario.nombre} ${usuario.apellido}`;
    this.mostrarListaUsuarios = false;
  }

  ocultarListaConDelay(): void {
    setTimeout(() => {
      this.mostrarListaUsuarios = false;
    }, 200);
  }

  // Métodos del Buscador de Clientes
  onBuscarCliente(): void {
    const texto = this.filtroCliente.toLowerCase().trim();
    if (!texto) {
      this.clientesFiltrados = this.clientes;
    } else {
      this.clientesFiltrados = this.clientes.filter(c => 
        (c.razon_social || '').toLowerCase().includes(texto) ||
        (c.cuit || '').toLowerCase().includes(texto)
      );
    }
    this.mostrarListaClientes = true;
  }

  seleccionarCliente(cliente: any): void {
    this.form.cliente = cliente.id_cliente; 
    this.filtroCliente = cliente.razon_social;
    this.mostrarListaClientes = false;
  }

  ocultarListaClientesConDelay(): void {
    setTimeout(() => {
      this.mostrarListaClientes = false;
    }, 200);
  }

  guardar(): void {
    if (!this.form.titulo?.trim() || !this.form.cliente) {
      this.toastr.warning('Por favor complete los campos requeridos (Título y Cliente)', 'Campos vacíos');
      return;
    }

    const usuarioActual = this.loginService.getUsuarioActual();

    let idUsuarioAsignado: number | undefined;
    if (this.esAdmin && this.form.usuario) {
      idUsuarioAsignado = this.form.usuario.id_usuario || this.form.usuario.id;
    } else if (usuarioActual) {
      idUsuarioAsignado = (usuarioActual as any).id_usuario || (usuarioActual as any).id;
    }

    if (!idUsuarioAsignado) {
      this.toastr.error('Debe seleccionar un usuario asignado válido', 'Atención');
      return;
    }

    const limpiarMoneda = (valor: any): number | null => {
      if (!valor) return null;
      if (typeof valor === 'number') return valor;
      const valorLimpio = valor.toString().replace(/[\$\s\.]/g, '').replace(',', '.');
      const numero = parseFloat(valorLimpio);
      return isNaN(numero) ? null : numero;
    };

    const nuevaOportunidadData = {
      titulo_oportunidad: this.form.titulo.trim(),
      id_usuario_asignado: idUsuarioAsignado,
      id_cliente: Number(this.form.cliente),
      marca: this.form.marca ? this.form.marca.trim() : null,
      producto: this.form.producto ? this.form.producto.trim() : null,
      fecha_cierre_estimado: this.form.fechaCierreEstimado || null,
      operacion_monto_estimado: limpiarMoneda(this.form.monto),
      precio_venta: limpiarMoneda(this.form.precioVenta),      
      margen_ganancia: this.form.margen_ganancia || null,
      plazo_pago_proveedor: this.form.plazoProveedor ? this.form.plazoProveedor.trim() : null,
      plazo_pago_cliente: this.form.plazoCliente ? this.form.plazoCliente.trim() : null,
      observaciones: this.form.observaciones ? this.form.observaciones.trim() : null
    };

    this.loading = true;

    this.oportunidadService.crearOportunidad(nuevaOportunidadData).subscribe({
      next: (res: any) => {
        this.loading = false;
        const idGenerado = res?.id_oportunidad || res?.id;
        this.toastr.success(`Oportunidad #${idGenerado} creada con éxito`, '¡Creada!');
        this.router.navigate(['/lista']);
      },
      error: (e) => {
        this.loading = false;
        console.error('Error al guardar:', e);
        this.toastr.error('Error al guardar la oportunidad en la base de datos', 'Error');
      }
    });
  }
}