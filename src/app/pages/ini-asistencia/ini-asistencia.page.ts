import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-ini-asistencia',
  templateUrl: './ini-asistencia.page.html',
  styleUrls: ['./ini-asistencia.page.scss'],
})
export class IniAsistenciaPage implements OnInit {
  asignaturasProfe: any[] = [];
  userId: string | undefined;
  selectedAsignaturaNombre: string | undefined;
  selectedAsignaturaSeccion: string | undefined;
  qrCodeData: string | undefined;
  qrCodeImageUrl: string | undefined;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().then(user => {
      if (user) {
        this.userId = user.uid;
        this.cargarAsignaturas();
      }
    });
  }

  cargarAsignaturas() {
    if (this.userId) {
      this.firestore.collection('profesores').doc(this.userId).valueChanges().subscribe((usuario: any) => {
        if (usuario && usuario.asign) {
          this.asignaturasProfe = usuario.asign;
        }
      });
    }
  }

  async generarQRCode() {
    if (this.selectedAsignaturaNombre && this.selectedAsignaturaSeccion) {
        try {
            const asignaturaSnapshot = await this.firestore.collection('asignaturas', ref =>
                ref.where('nombre', '==', this.selectedAsignaturaNombre)
                   .where('seccion', '==', this.selectedAsignaturaSeccion)
            ).get().toPromise();

            if (!asignaturaSnapshot?.empty) {
                const asignaturaDoc = asignaturaSnapshot?.docs[0];
                const asignaturaId = asignaturaDoc?.id;

                this.qrCodeData = JSON.stringify({
                    asignaturaId: asignaturaId
                });
                this.qrCodeImageUrl = await QRCode.toDataURL(this.qrCodeData);
            } else {
                console.error(`Asignatura no encontrada para Nombre: ${this.selectedAsignaturaNombre} y Sección: ${this.selectedAsignaturaSeccion}`);
                alert(`Asignatura no encontrada para Nombre: ${this.selectedAsignaturaNombre} y Sección: ${this.selectedAsignaturaSeccion}`);
            }
        } catch (error) {
            console.error("Error buscando la asignatura en Firebase:", error);
            alert("Hubo un error buscando la asignatura en Firebase. Por favor, intenta nuevamente.");
        }
    } else {
        alert("Por favor selecciona tanto el nombre como la sección de la asignatura.");
    }
  }
  

}
