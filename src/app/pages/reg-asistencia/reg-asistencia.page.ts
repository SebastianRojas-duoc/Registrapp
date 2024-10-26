import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reg-asistencia',
  templateUrl: './reg-asistencia.page.html',
  styleUrls: ['./reg-asistencia.page.scss'],
})
export class RegAsistenciaPage implements OnInit {
  asignaturaId: string | null = null;
  asignatura: any;
  nombreUsuario?: string;
  correoUsuario: string = ''; 
  uid?: string;
  password: string = ''; 
  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.asignaturaId = params['asignaturaId'];
      this.correoUsuario = params['email'];
      
      if (this.asignaturaId) {
        const parsedData = JSON.parse(this.asignaturaId);
        this.obtenerAsignatura(parsedData.nombre, parsedData.seccion);
      } else {
        console.error("Datos de asignatura no encontrados en QR.");
        this.presentAlert("Error", "No se encontraron datos de la asignatura.");
      }
  
      this.obtenerUsuarioLogueado();
    });
  }

  async obtenerAsignatura(nombre: string, seccion: string) {
    this.firestore.collection('asignaturas', ref => ref
      .where('nombre', '==', nombre)
      .where('seccion', '==', seccion))
      .valueChanges()
      .subscribe((asignaturas: any[]) => {
        if (asignaturas && asignaturas.length > 0) {
          this.asignatura = asignaturas[0];
        } else {
          console.error("Asignatura no encontrada con nombre y sección especificados.");
          this.presentAlert("Error", "No se encontró la asignatura especificada.");
        }
      }, error => {
        console.error("Error al obtener la asignatura:", error);
        this.presentAlert("Error", "Ocurrió un error al obtener la asignatura.");
      });
  }
  

  async obtenerUsuarioLogueado() {
    const user = await this.authService.getCurrentUser();
    if (user) {
      this.uid = user.uid;
      this.nombreUsuario = user.displayName || '';
      this.correoUsuario = user.email || '';
    } else {
      this.presentAlert("Error", "No hay ningún usuario logueado.");
    }
  }

  async registrarAsistencia() {
    if (!this.asignatura) {
      this.presentAlert("Error", "No se encontró la asignatura.");
      return;
    }

    const alumnoDoc = this.firestore.collection('alumnos').doc(this.uid);
    alumnoDoc.valueChanges().subscribe((alumno: any) => {
      if (alumno && alumno.asign) {
        const inscrito = alumno.asign.some((asign: any) => asign.nombre === this.asignatura.nombre);

        if (inscrito) {
          const asistenciaData = {
            nombre: this.nombreUsuario,
            correo: this.correoUsuario,
            asignatura: this.asignatura.nombre,
            seccion: this.asignatura.seccion,
            fecha: new Date(),
            alumnos: [this.correoUsuario]
          };

          this.firestore.collection('clases').add(asistenciaData).then(() => {
            this.presentAlert("Registro exitoso", "Tu asistencia ha sido registrada.");
          }).catch(error => {
            this.presentAlert("Error", "No se pudo registrar la asistencia. Inténtalo de nuevo.");
            console.error("Error al registrar asistencia:", error);
          });
        } else {
          this.presentAlert("Error", "No estás inscrito en esta asignatura.");
        }
      } else {
        this.presentAlert("Error", "No se encontró el alumno.");
      }
    }, error => {
      this.presentAlert("Error", "Error al obtener los datos del alumno.");
      console.error("Error al obtener datos del alumno:", error);
    });
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
