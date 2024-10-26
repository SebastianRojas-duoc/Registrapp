import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuarios = [
    {'email':'admin@admin.cl','pass':'admin123','tipo':'admin'},
    {'email':'alumno@alumno.cl','pass':'alumno123','tipo':'alumno'},
    {'email':'alumno2@alumno.cl','pass':'alumno2','tipo':'alumno'},
    {'email':'profe@profe.cl','pass':'profe123','tipo':'profe'},
  ]

  constructor() { }

  getUsuarios() {
    return this.usuarios;
  }

  getUsuarioByEmail(email:string) {
    return this.usuarios.find(aux => aux.email === email);
  }

  addUsuario(usuario: Usuario) {
    this.usuarios.push(usuario);
  }

  deleteUsuario() {

  }

  updateUsuario() {

  }
}
