import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
})
export class SplashscreenPage implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private firestore: AngularFirestore) { }

  ngOnInit() {
    setTimeout(() => {
      this.checkLogin();
    }, 2000);
  }

  async checkLogin() {
    this.authService.isLogged().subscribe(async (user) => {
      if (user) {
        try {
          await this.checkHuellaDigital();
          const usuarioLogeado = await this.firestore.collection('usuarios').doc(user.uid).get().toPromise();
          const userData = usuarioLogeado?.data() as Usuario;

          if(userData) {
            if (userData.tipo === 'admin') {
              this.router.navigate(['/admin']);
            } else if (userData.tipo === 'alumno') {
              this.router.navigate(['/alumnos']);
            } else if (userData.tipo === 'profesor') {
              this.router.navigate(['/profe']);
            }  
          }
        } catch (error) {
          console.error('Error durante la autenticación:', error);
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  async checkHuellaDigital() {
    try {
      await NativeBiometric.verifyIdentity({
        reason: 'Por favor, autentícate para continuar',
        title: 'Autentición Biométrica',
        subtitle: 'Usa tu huella digital o Face ID',
        description: 'Coloca tu huella en el sensor para ingresar.'
      });
    } catch (error) {
      console.error('Error en la autenticación biométrica:', error);
      throw error;
    }
  }
}
