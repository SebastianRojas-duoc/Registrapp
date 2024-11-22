import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Asignatura } from 'src/app/interfaces/asignatura';
import { Carrera } from 'src/app/interfaces/carrera';
import { AuthService } from 'src/app/services/firebase/auth.service';
import * as QRCode from 'qrcode';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-detalle-asign',
  templateUrl: './detalle-asign.page.html',
  styleUrls: ['./detalle-asign.page.scss'],
})
export class DetalleAsignPage implements OnInit {
  asignaturaId?: string;
  asignatura: Asignatura | undefined;
  carrera: string | undefined;
  isProfesor: boolean = false; 
  qrCodeData: string | undefined;
  qrCodeImageUrl: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.asignaturaId = params.get('id')!;
      this.obtenerDetallesAsignatura(this.asignaturaId);
    });

    this.authService.getCurrentUser().then(user => {
      if (user) {
        this.firestore.collection('usuarios').doc(user.uid).get().toPromise().then((doc) => {
          const userData = doc?.data() as Usuario | undefined;
          if (userData?.tipo === 'profesor') {
            this.isProfesor = true; 
          }
        });
      }
    });
  }

  obtenerDetallesAsignatura(id: string) {
    this.firestore.collection('asignaturas').doc(id).valueChanges().subscribe((asignaturaData) => {
      const asignatura = asignaturaData as Asignatura | undefined;
      if (asignatura) {
        this.asignatura = asignatura;

        const carreraId = this.asignatura.carrera;
        this.firestore.collection('carreras').doc(carreraId).valueChanges().subscribe((carreraData) => {
          const carrera = carreraData as Carrera | undefined; 
          if (carrera) {
            this.carrera = carrera.nombre;
          } else {
            console.error(`No se encontró la carrera con ID: ${carreraId}`);
          }
        });
      } else {
        console.error(`No se encontró la asignatura con ID: ${id}`);
      }
    });
  }

  async generarQRCode() {
    if (this.asignatura) {
      try {
        this.qrCodeData = JSON.stringify({ asignaturaId: this.asignatura.id });
        this.qrCodeImageUrl = await QRCode.toDataURL(this.qrCodeData);
      } catch (error) {
        console.error("Error generando el QR:", error);
        alert("Hubo un error generando el QR.");
      }
    }
  }
}
