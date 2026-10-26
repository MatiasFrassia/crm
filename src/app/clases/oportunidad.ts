import { Usuario } from "./usuario";
// Asumiendo que tienes una clase Cliente, si no la tienes puedes usar 'any' temporalmente
// import { Cliente } from "./cliente"; 

export class Oportunidad {
    public id_oportunidad?: number;
    public id?: number; // Opcional por compatibilidad de IDs
    public titulo_oportunidad?: string;
    
    // 🟢 Relaciones actualizadas con el Backend
    public id_usuario_asignado?: number;
    public usuarioAsignado?: Usuario;
    
    public id_cliente?: number;
    public datosCliente?: any; // Aquí viaja la Razón Social y CUIT desde el backend
    
    // Fechas
    public fecha_inicio?: Date | string;
    public fecha_cierre_estimado?: Date | string;
    public fecha_facturacion_estimado?: Date | string;
    public createdAt?: Date | string;
    public updatedAt?: Date | string;
    public fecha_actualizacion?: Date | string; // Mantenido por compatibilidad
    
    // Detalles comerciales
    public marca?: string;
    public producto?: string;
    public operacion_monto_estimado?: number;
    public costo?: number;
    public precio_venta?: number; // 🟢 Nuevo campo que agregamos
    public margen_ganancia?: number;
    
    // Estado y plazos
    public avance_proyecto?: AvanceProyecto | number;
    public plazo_pago_proveedor?: string;
    public plazo_pago_cliente?: string;
    public observaciones?: string;
    
    public comentarios: Comentario[] = [];

    // 🛠️ Constructor flexible: permite instanciar la clase pasando un JSON parcial
    constructor(init?: Partial<Oportunidad>) {
        if (init) {
            Object.assign(this, init);
        }
        
        // Valores por defecto si no vienen en la inicialización
        this.comentarios = init?.comentarios || [];
        this.avance_proyecto = init?.avance_proyecto ?? AvanceProyecto.Inicial;
        this.fecha_actualizacion = init?.updatedAt || init?.fecha_actualizacion || new Date();
    }
}

// 🟢 Actualizado para coincidir con los porcentajes reales del sistema
export enum AvanceProyecto {
    Perdida = 0,
    Inicial = 1,
    EnProgreso = 30,
    BestCase = 60,
    Compromiso = 90,
    Ganado = 100
}

// 🟢 Actualizado para soportar archivos adjuntos y Firebase
export interface Comentario {
    id_comentario?: number;
    id_oportunidad?: number;
    id_usuario?: number;
    usuario?: any; // Datos del autor anidados (nombre, apellido)
    texto?: string;
    archivo_adjunto?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}