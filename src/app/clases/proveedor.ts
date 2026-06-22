export class Proveedor {
    public id_proveedor:number = 0;
    public razon_social:string;
    public cuit:string;
    public direccion:string;
    public telefono:number;
    public email:string;

    constructor(razon_social:string, cuit:string, direccion:string, telefono:number, email:string){
        this.id_proveedor +=1;
        this.razon_social = razon_social;
        this.cuit = cuit;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
    }}
