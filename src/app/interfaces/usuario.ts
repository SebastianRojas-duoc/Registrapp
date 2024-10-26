export interface Usuario {
    email:string;
    pass:string;
    tipo:string;
    nombre:string;
    enabled: boolean; 

    asign?: Array<{ nombre: string; seccion: string; }>;
    carrera?: string;

}