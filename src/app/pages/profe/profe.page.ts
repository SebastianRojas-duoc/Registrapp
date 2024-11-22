import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Asegúrate de tener la interfaz para Asignatura
import { Asignatura } from 'src/app/interfaces/asignatura';

@Component({
  selector: 'app-profe',
  templateUrl: './profe.page.html',
  styleUrls: ['./profe.page.scss'],
})
export class ProfePage implements OnInit {

  asignaturasProfe: Asignatura[] = []; // Cambia el tipo de asignaturas
  uid: string = '';
  nombreUsuario?: string;
  asignaturasExpandido: boolean = false;
  carreraSeleccionada?: string;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().then(user => {
      if (user) {
        this.uid = user.uid;
        this.checkCarrera();
        this.cargarAsignaturasProfe();
        this.obtenerUsuarioLogueado(); 
      }
    });
  }

  obtenerUsuarioLogueado() {
    this.authService.getCurrentUser().then(user => {
      if (user) {
        this.firestore.collection('profesores').doc(user.uid).valueChanges().subscribe((usuario: any) => {
          if (usuario) {
            this.nombreUsuario = usuario.nombre; 
          }
        });
      }
    });
  }

  cargarAsignaturasProfe() {
    this.firestore.collection('profesores').doc(this.uid).valueChanges().subscribe(async (usuario: any) => {
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
  
        this.asignaturasProfe = asignaturasConId;
        console.log("Asignaturas cargadas con ID:", this.asignaturasProfe);
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
    const profeDoc = this.firestore.collection('profesores').doc(this.uid);
    const profeSnapshot = await profeDoc.get().toPromise();
    const profe = profeSnapshot?.data() as { carrera?: string };
    if (profe?.carrera) {
      this.carreraSeleccionada = profe.carrera;
    }
  }

  irADetalleAsignatura(asignatura: Asignatura) {
    const asignaturaId = asignatura.id; 
    this.router.navigate(['/detalle-asign', { id: asignaturaId }]);
  }
}
