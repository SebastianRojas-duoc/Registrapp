import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.page.html',
  styleUrls: ['./alumnos.page.scss'],
})
export class AlumnosPage implements OnInit {
  asignaturasAlumno: any[] = [];
  uid: string = '';
  nombreUsuario?: string;
  asignaturasExpandido: boolean = false;
  carreraSeleccionada?: string;
  correoUsuario?:string;
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().then(user => {
      if (user) {
        this.uid = user.uid;
        this.checkCarrera();
        this.cargarAsignaturasAlumno();
        this.obtenerUsuarioLogueado();
      }
    });
  }

  obtenerUsuarioLogueado() {
    this.authService.getCurrentUser().then(user => {
      if (user) {
        this.firestore.collection('alumnos').doc(user.uid).valueChanges().subscribe((usuario: any) => {
          if (usuario) {
            this.nombreUsuario = usuario.nombre;
          }
        });
      }
    });
  }

  cargarAsignaturasAlumno() {
    this.firestore.collection('alumnos').doc(this.uid).valueChanges().subscribe(async (usuario: any) => {
      if (usuario && usuario.asign) {
        const asignaturasConId: any[] = [];
  
        for (const asignatura of usuario.asign) {
          const querySnapshot = await this.firestore.collection('asignaturas', ref => 
            ref.where('nombre', '==', asignatura.nombre).where('seccion', '==', asignatura.seccion)).get().toPromise();
  
          if (!querySnapshot?.empty) {
            const asignaturaData = querySnapshot?.docs[0].data();
            const asignaturaId = querySnapshot?.docs[0].id;
  
            if (typeof asignaturaData === 'object' && asignaturaData !== null) {
              asignaturasConId.push({ id: asignaturaId, ...asignaturaData });
            } else {
              console.error(`Asignatura no es un objeto válido: ${asignaturaData}`);
            }
          } else {
            console.error(`No se encontró la asignatura con nombre: ${asignatura.nombre} y sección: ${asignatura.seccion}`);
          }
        }
  
        this.asignaturasAlumno = asignaturasConId;
        console.log("Asignaturas cargadas con ID:", this.asignaturasAlumno);
      }
    });
  }

  toggleAsignaturas() {
    this.asignaturasExpandido = !this.asignaturasExpandido;
  }

  agregarAsignaturas() {
    this.router.navigate(['/asign']);
  }

  async checkCarrera() {
    const alumnoDoc = this.firestore.collection('alumnos').doc(this.uid);
    const alumnoSnapshot = await alumnoDoc.get().toPromise();
    const alumno = alumnoSnapshot?.data() as { carrera?: string };
    if (alumno?.carrera) {
      this.carreraSeleccionada = alumno.carrera;
    }
  }


  
  async scanQRCode() {
    const status = await BarcodeScanner.checkPermission({ force: true });

    if (status.granted) {
      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        const parsedQRData = JSON.parse(result.content);
        console.log('Datos del QR escaneado:', parsedQRData);

        if (parsedQRData.asignaturaId) {
          const asignaturaId = parsedQRData.asignaturaId;
          this.router.navigate(['/reg-asistencia'], {
            queryParams: {
              asignaturaId: asignaturaId,
              email: this.correoUsuario
            }
          });
        } else {
          this.presentAlert("Error", "El código QR no contiene un ID de asignatura válido.");
        }
      } else {
        this.presentAlert("Error", "No se encontró contenido en el código QR.");
      }
    } else if (status.denied) {

      this.presentAlert(
        "Permiso requerido",
        "Por favor, habilita el permiso de cámara en los ajustes de tu dispositivo."
      );
      
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

  Irperfil() {
    this.router.navigate(['/perfil']);
  }
}
