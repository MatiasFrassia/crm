export class Usuario {
    public id_usuario:number;
    public nombre: string;
    public apellido:string;
    public email: string;
    public password:string;
    public isAdmin: boolean;


    constructor(id_usuario:number, nombre:string, apellido:string, email:string, password:string, isAdmin: boolean){
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
    }
}

