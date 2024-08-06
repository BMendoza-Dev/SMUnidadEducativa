export interface ALectivo {
    id?:number;
    nombre?: string;
    anioInicio?: string;
    anioFin?: string;
}

export interface Curso {
    id?:number;
    nombre?: string;
}

export interface Usuarios{
    id?:number;
    nombres?: string;
    cedula?:string;
    apellidos?: string;
    nacionalidad?: any
    genero?: any;
    fecha_nacimiento?: any;
}

export interface Representante {
    id?:number;
    usuarios?:Usuarios;
    parentesco?:string;
    direccion?:string;
    telefono?:string;
    correo?:string;
}

export interface Estudiante {
    id?:number;
    usuarios?:Usuarios;
    direccion?:string;
    telefono?:string;
    correo?:string;
}