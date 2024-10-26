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
  selectedAsignatura: string | undefined;
  qrCodeData: string | undefined;
  qrCodeImageUrl: string | undefined;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) { }

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
    if (this.selectedAsignatura) {
      this.qrCodeData = JSON.stringify({
        asignaturaId: this.selectedAsignatura
      });

      this.qrCodeImageUrl = await QRCode.toDataURL(this.qrCodeData);  
    }
    
  }
}
