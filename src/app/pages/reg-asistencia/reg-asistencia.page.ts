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
  password?:string;
  uid?: string;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.asignaturaId = params['asignaturaId'];
      this.obtenerAsignatura();
      this.obtenerUsuarioLogueado();
    });
  }

  async obtenerAsignatura() {
    if (this.asignaturaId) {
      const asignaturaDoc = this.firestore.collection('asignaturas').doc(this.asignaturaId);
      asignaturaDoc.valueChanges().subscribe((asignatura: any) => {
        if (asignatura) {
          this.asignatura = asignatura;
        } else {
          console.error(`Asignatura no encontrada para ID: ${this.asignaturaId}`);
        }
      });
    }
  }

  async obtenerUsuarioLogueado() {
    const user = await this.authService.getCurrentUser();
    if (user) {
      this.uid = user.uid;
      this.nombreUsuario = user.displayName || '';
      this.correoUsuario = user.email || '';
    }
  }

  async registrarAsistencia() {
    if (this.asignatura && this.uid) {
      const asistenciaData = {
        nombreAlumno: this.nombreUsuario,
        correoAlumno: this.correoUsuario,
        asignatura: this.asignatura.nombre,
        seccion: this.asignatura.seccion,
        fecha: new Date(),
      };

      try {
        await this.firestore.collection('clases').add(asistenciaData);
        this.presentAlert("Registro exitoso", "Tu asistencia ha sido registrada.");
      } catch (error) {
        console.error("Error al registrar asistencia:", error);
        this.presentAlert("Error", "No se pudo registrar la asistencia.");
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
