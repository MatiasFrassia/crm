import { Cliente } from "./cliente";
import { Proveedor } from "./proveedor";
import { Usuario } from "./usuario";

export class Oportunidad {
    public id_oportunidad:number = 0;
    public titulo_oportunidad:string;
    public usuario_asignado:Usuario;
    public fecha_inicio: Date;
    public fecha_cierre_estimado:Date;
    public fecha_facturacion_estimado: Date;
    public marca:string;
    public producto:string;
    public cantidad:number;
    public cliente: string;
    public proveedor: string;
    public operacion_monto_estimado:number;
    public operacion_costo:number;
    public precio_venta:number;
    public margen_ganancia:number;
    public avance_proyecto:avanceProyecto;
    public plazo_pago_proveedor:string;
    public plazo_pago_cliente:string;
    public observaciones:string;
    public fecha_actualizacion: Date;
    public comentarios: Comentario[] = [];

    constructor(
        titulo_oportunidad: string,
        usuario_asignado: Usuario,
        fecha_inicio: Date,
        fecha_cierre_estimado: Date,
        fecha_facturacion_estimado: Date,
        marca: string,
        producto: string,
        cantidad: number,
        cliente: string,
        proveedor: string,
        operacion_monto_estimado: number,
        operacion_costo: number,
        precio_venta: number,
        margen_ganancia: number,
        avance_proyecto: avanceProyecto,
        plazo_pago_proveedor: string,
        plazo_pago_cliente: string,
        observaciones: string,
        
    ) {
        
        this.titulo_oportunidad = titulo_oportunidad;
        this.usuario_asignado = usuario_asignado;
        this.fecha_inicio = fecha_inicio;
        this.fecha_cierre_estimado = fecha_cierre_estimado;
        this.fecha_facturacion_estimado = fecha_facturacion_estimado;
        this.marca = marca;
        this.producto = producto;
        this.cantidad = cantidad;
        this.cliente = cliente;
        this.proveedor = proveedor;
        this.operacion_monto_estimado = operacion_monto_estimado;
        this.operacion_costo = operacion_costo;
        this.precio_venta = precio_venta;
        this.margen_ganancia = margen_ganancia;
        this.avance_proyecto = avance_proyecto;
        this.plazo_pago_proveedor = plazo_pago_proveedor;
        this.plazo_pago_cliente = plazo_pago_cliente;
        this.observaciones = observaciones;
        this.fecha_actualizacion = new Date();
    }


}

export enum avanceProyecto{
    Iniciado,
    Avanzado,
    Finalizado
}

export interface Comentario {
  texto: string;
  fecha: Date;
}