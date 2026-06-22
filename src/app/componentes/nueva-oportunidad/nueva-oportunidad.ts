import { Component } from '@angular/core';
import { Oportunidad, avanceProyecto } from '../../clases/oportunidad';
import { FormsModule } from '@angular/forms';
import { OportunidadService } from '../../services/oportunidad';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { CotizacionDolar } from '../cotizacion-dolar/cotizacion-dolar';
import { LoginService } from '../../services/login-service';
import { Usuario } from '../../clases/usuario';
import { UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-nueva-oportunidad',
  imports: [FormsModule, RouterLink, CommonModule, CotizacionDolar],
  templateUrl: './nueva-oportunidad.html',
  styleUrl: './nueva-oportunidad.css',
})
export class NuevaOportunidad {
  form: any = {
    titulo: '',
    usuario: '',
    cliente: '',
    marca: '',
    producto: '',
    cantidad: null,
    proveedor:'',
    fechaInicio: '',
    fechaCierre: '',
    fechaFacturacion: '',
    monto: null,
    costo: null,
    precio: null,
    margen: null,
    avance: 'Inicial',
    plazoProveedor: '',
    plazoCliente: '',
    observaciones: ''
  };
  public esAdmin: boolean = false;
  public usuarios: Usuario[] = [];
  

constructor(private oportunidadServices: OportunidadService,
   private loginService: LoginService,
  private usuarioService: UsuarioService){}

  ngOnInit() {

  const usuario =
    this.loginService.getUsuarioActual();

  this.esAdmin =
    usuario?.isAdmin ?? false;

  this.usuarios =
    this.usuarioService.getUsuarios();

}
  

  guardar() {
    const usuarioActual = this.loginService.getUsuarioActual();
    let usuarioAsignado;

    if (this.esAdmin) {

      usuarioAsignado = this.form.usuario;

    } else {
      usuarioAsignado = usuarioActual;
    }

    console.log(this.oportunidadServices);
    const nuevaOportunidad = new Oportunidad(
       // id_oportunidad
      this.form.titulo,
      usuarioAsignado,
      this.form.fechaInicio,
      this.form.fechaCierre,
      this.form.fechaFacturacion,
      this.form.marca,
      this.form.producto,
      this.form.cantidad,
      this.form.cliente,
      this.form.proveedor,
      this.form.monto,
      this.form.costo,
      this.form.precio,
      this.form.margen,
      this.form.avance,
      this.form.plazoProveedor,
      this.form.plazoCliente,
      this.form.observaciones
        
    );
    console.log(nuevaOportunidad);

    // ✅ guardar en el service
    this.oportunidadServices.agregarOportunidades(nuevaOportunidad);

    console.log("Oportunidad guardada:", nuevaOportunidad);
    // 🔄 limpiar formulario
    this.form = {
      titulo: '',
      usuario: '',
      cliente: '',
      marca: '',
      producto: '',
      cantidad: null,
      fechaInicio: '',
      fechaCierre: '',
      fechaFacturacion: '',
      monto: null,
      costo: null,
      precio: null,
      margen: null,
      avance: 'Inicial',
      plazoProveedor: '',
      plazoCliente: '',
      observaciones: ''
    };
  }

  //DOLAR HOY
  
  
}
