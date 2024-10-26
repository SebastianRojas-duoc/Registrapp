import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { AlertController } from '@ionic/angular';
import { Clases } from 'src/app/interfaces/clases';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-reg-asistencia',
  templateUrl: './reg-asistencia.page.html',
  styleUrls: ['./reg-asistencia.page.scss'],
})
export class RegAsistenciaPage implements OnInit {
  asignaturaId: string | null = null;
  asignatura: any;
  nombreUsuario?: string;
  correoUsuario?: string;
  uid?: string;
  password?:string;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.asignaturaId = params['asignaturaId'];
      console.log(`Asignatura ID recibido: ${this.asignaturaId}`);
      this.obtenerAsignatura();
      this.obtenerUsuarioLogueado();
    });
  }

  async obtenerAsignatura() {
    if (this.asignaturaId) {
      try {
        const asignaturaDoc = await this.firestore.collection('asignaturas').doc(this.asignaturaId).get().toPromise();
        if (asignaturaDoc && asignaturaDoc.exists) {
          this.asignatura = asignaturaDoc.data();
          console.log("Datos de asignatura obtenidos:", this.asignatura);
        } else {
          console.error(`Asignatura no encontrada para ID: ${this.asignaturaId}`);
        }
      } catch (error) {
        console.error("Error al obtener la asignatura:", error);
      }
    }
  }

  async obtenerUsuarioLogueado() {
    try {
      const user = await this.authService.getCurrentUser();
      if (user) {
        this.uid = user.uid;
        this.nombreUsuario = user.displayName || '';
        this.correoUsuario = user.email || '';
      } else {
        console.error("Usuario no logueado.");
      }
    } catch (error) {
      console.error("Error al obtener el usuario logueado:", error);
    }
  }

  async registrarAsistencia() {
    if (this.asignatura && this.uid) {
      const fechaHoy = new Date();
      fechaHoy.setHours(0, 0, 0, 0);
  
      const correoUsuario = this.correoUsuario || '';
      
      const usuarioRef = await this.firestore.collection('alumnos').doc(this.uid).get().toPromise();
      if (!usuarioRef || !usuarioRef.exists) {
        this.presentAlert("Error", "No estás registrado como alumno.");
        return;
      }
  
      const usuarioData = usuarioRef.data() as Usuario;
      const usuarioAsignaturas = usuarioData?.asign || [];
      const usuarioCarrera = usuarioData?.carrera;
  
      const asignaturaInscrita = usuarioAsignaturas.find((asignatura: any) => 
        asignatura.nombre === this.asignatura.nombre &&
        asignatura.seccion === this.asignatura.seccion
      );
  
      if (!asignaturaInscrita) {
        this.presentAlert("Error", "No estás inscrito en esta asignatura.");
        return;
      }
  
      if (usuarioCarrera !== this.asignatura.carrera) {
        this.presentAlert("Error", "No estás inscrito en la carrera correcta para esta asignatura.");
        return;
      }
  
      const clasesRef = this.firestore.collection('clases', ref =>
        ref.where('asignatura', '==', this.asignatura.nombre)
           .where('seccion', '==', this.asignatura.seccion)
           .where('fecha', '==', fechaHoy)
      );
  
      const snapshot = await clasesRef.get().toPromise();
  
      if (!snapshot?.empty) {
        const docId = snapshot?.docs[0].id;
        const docData = snapshot?.docs[0].data() as Clases;
  
        const correoAlumnoArray = docData.correoAlumno || [];
        if (!correoAlumnoArray.includes(correoUsuario)) {
          correoAlumnoArray.push(correoUsuario);
  
          await this.firestore.collection('clases').doc(docId).update({
            correoAlumno: correoAlumnoArray
          });
          this.presentAlert("Registro exitoso", "Tu asistencia ha sido registrada.");
        } else {
          this.presentAlert("Aviso", "Ya has registrado asistencia para hoy.");
        }
  
      } else {
        const asistenciaData: Clases = {
          asignatura: this.asignatura.nombre,
          seccion: this.asignatura.seccion,
          fecha: fechaHoy,
          correoAlumno: [correoUsuario]
        };
  
        try {
          await this.firestore.collection('clases').add(asistenciaData);
          this.presentAlert("Registro exitoso", "Tu asistencia ha sido registrada.");
        } catch (error) {
          console.error("Error al registrar asistencia:", error);
          this.presentAlert("Error", "No se pudo registrar la asistencia.");
        }
      }
    } else {
      this.presentAlert("Error", "Asignatura o usuario no definido.");
    }
  }
  
  
  

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
