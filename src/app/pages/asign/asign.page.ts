import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-asign',
  templateUrl: './asign.page.html',
  styleUrls: ['./asign.page.scss'],
})
export class AsignPage implements OnInit {

  asignaturasDisponibles: any[] = [];
  asignaturasUsuario: any[] = []; 
  uid: string = '';

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().then(user => {
      if (user) {
        this.uid = user.uid;
        this.cargarAsignaturasUsuario();
      }
    });
  }

  cargarAsignaturasDisponibles() {
    this.firestore.collection('usuarios').doc(this.uid).valueChanges().subscribe((usuarios: any) => {
      if (usuarios.tipo == 'alumno') {
        this.firestore.collection('alumnos').doc(this.uid).valueChanges().subscribe((alumno: any) => {
          if (alumno && alumno.carrera) {
            this.firestore.collection('carreras').doc(alumno.carrera).valueChanges().subscribe((carrera: any) => {
              this.asignaturasDisponibles = carrera.asignaturas;
            });
          }
        });
      } else if (usuarios.tipo == 'profesor') {
        this.firestore.collection('profesores').doc(this.uid).valueChanges().subscribe((profe: any) => {
          if (profe && profe.carrera) {
            this.firestore.collection('carreras').doc(profe.carrera).valueChanges().subscribe((carrera: any) => {
              this.asignaturasDisponibles = carrera.asignaturas;
            });
          }
        });
      }
    });
  }

  cargarAsignaturasUsuario() {
    this.firestore.collection('usuarios').doc(this.uid).valueChanges().subscribe((usuarios: any) => {
      if (usuarios.tipo == 'alumno') {
        this.firestore.collection('alumnos').doc(this.uid).valueChanges().subscribe((usuario: any) => {
          if (usuario && usuario.asign) {
            this.asignaturasUsuario = usuario.asign;
            this.cargarAsignaturasDisponibles();
          }
        });
      } else if (usuarios.tipo == 'profesor') {
        this.firestore.collection('profesores').doc(this.uid).valueChanges().subscribe((usuario: any) => {
          if (usuario && usuario.asign) {
            this.asignaturasUsuario = usuario.asign;
            this.cargarAsignaturasDisponibles();
          }
        });
      }
    });
  }

  async guardarAsignaturas() {
    this.firestore.collection('usuarios').doc(this.uid).valueChanges().subscribe((usuarios: any) => {
      if (usuarios.tipo == 'alumno') {
        this.firestore.collection('alumnos').doc(this.uid).update({
          asign: this.asignaturasUsuario
        });
        this.router.navigate(['/alumnos']); 
      } else if (usuarios.tipo == 'profesor') {
        this.firestore.collection('profesores').doc(this.uid).update({
          asign: this.asignaturasUsuario
        });
        this.router.navigate(['/profe']); 
      }
    });
  }

  toggleAsignatura(asignatura: any) {
    const index = this.asignaturasUsuario.findIndex(a => a.nombre === asignatura.nombre && a.seccion === asignatura.seccion);
    if (index > -1) {
      this.asignaturasUsuario.splice(index, 1);
    } else {
      this.asignaturasUsuario.push({ nombre: asignatura.nombre, seccion: asignatura.seccion });
    }
  }

  asignSeleccionada(asignatura: any): boolean {
    return this.asignaturasUsuario.some(a => a.nombre === asignatura.nombre && a.seccion === asignatura.seccion);
  }
}
