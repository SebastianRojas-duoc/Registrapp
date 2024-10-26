import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  nombreUsuario?: string;
  correoUsuario?: string;
  tipoUsuario?: string;
  carreraNombre?: string;
  asignaturasInscritas: any[] = [];

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().then(user => {
      if (user) {
        this.correoUsuario = user.email ?? ''; 
        this.cargarPerfil(user.uid);
      }
    });
  }

  cargarPerfil(uid: string) {
    this.firestore.collection('alumnos').doc(uid).valueChanges().subscribe((alumno: any) => {
      if (alumno) {
        this.nombreUsuario = alumno.nombre;
        this.tipoUsuario = 'alumno';
        this.obtenerNombreCarrera(alumno.carrera);
        this.asignaturasInscritas = alumno.asign.map((asignatura: any) => ({
          nombre: asignatura.nombre,
          seccion: asignatura.seccion
        }));
      } else {
        this.firestore.collection('profesores').doc(uid).valueChanges().subscribe((profesor: any) => {
          if (profesor) {
            this.nombreUsuario = profesor.nombre;
            this.tipoUsuario = 'profesor';
            this.obtenerNombreCarrera(profesor.carrera);
            this.asignaturasInscritas = profesor.asign.map((asignatura: any) => ({
              nombre: asignatura.nombre,
              seccion: asignatura.seccion
            }));
          } else {
            this.firestore.collection('usuarios').doc(uid).valueChanges().subscribe((admin: any) => {
              if (admin) {
                this.nombreUsuario = admin.nombre;
                this.tipoUsuario = 'admin';
              }
            });
          }
        });
      }
    });
  }

  obtenerNombreCarrera(carreraId: string) {
    this.firestore.collection('carreras').doc(carreraId).valueChanges().subscribe((carrera: any) => {
      if (carrera) {
        this.carreraNombre = carrera.nombre;
      }
    });
  }
}
