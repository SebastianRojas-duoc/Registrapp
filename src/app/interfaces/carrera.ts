export interface Carrera{
    id?:string;
    nombre?: string;
    asignaturas?: { id: string; nombre: string; seccion: string; descripcion: string }[];
}