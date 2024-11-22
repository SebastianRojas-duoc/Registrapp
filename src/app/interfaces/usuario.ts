export interface Usuario {
    email:string;
    pass:string;
    tipo:string;
    nombre:string;
    enabled: boolean; 
    asignaturas?: Array<{ id: string; nombre: string; seccion: string; }>;
    carrera?: string;

}