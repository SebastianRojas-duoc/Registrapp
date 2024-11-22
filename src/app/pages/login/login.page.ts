import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/firebase/auth.service';
import Swal from 'sweetalert2';
import { GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  emailValue?: string = '';
  passValue?: string = '';

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private menuController: MenuController,
    private authservice: AuthService,
    private firestore: AngularFirestore
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.menuController.enable(false);
  }

  async login() {
    try {
      const loading = await this.loadingController.create({
        message: 'Cargando.....'
      });
      await loading.present();

      const email = this.emailValue;
      const pass = this.passValue;

      const aux = await this.authservice.login(email as string, pass as string);

      if (aux.user) {
        const usuarioLogeado = await this.firestore.collection('usuarios').doc(aux.user.uid).get().toPromise();
        const usuario = usuarioLogeado?.data() as Usuario;

        localStorage.setItem('usuarioLogin', email as string);

        await loading.dismiss();

        if (usuario.tipo === 'admin') {
          this.router.navigate(['/admin']);
        } else if (usuario.tipo === 'alumno') {
          this.router.navigate(['/alumnos']);
        } else if (usuario.tipo === 'profesor') {
          this.router.navigate(['/profe']);
        } else {
          this.router.navigate(['/register']);
        }
      }
    } catch (error: any) {
      let errorMessage = 'Hubo un error al iniciar sesión.';
      await this.loadingController.dismiss();
      if (error.message === 'auth/user-disabled') {
        errorMessage = 'Tu cuenta ha sido deshabilitada. Contacta al administrador.';
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'OK',
        heightAuto: false
      });

      this.emailValue = '';
      this.passValue = '';
    }
  }

  async loginWithGoogle() {
    await this.handleSocialLogin('google');
  }
  
  async loginWithGitHub() {
    await this.handleSocialLogin('github');
  }
  
  private async handleSocialLogin(provider: 'google' | 'github') {
    const allowedDomains = ['@duocuc.cl', '@profesor.duoc.cl', '@admin.cl'];
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();
  
    try {
      const credential = await this.authservice.signInWithProvider(provider);
      const email = credential.user?.email;
  
      if (email && allowedDomains.some(domain => email.endsWith(domain))) {
        const userRef = this.firestore.collection('usuarios', ref => ref.where('email', '==', email));
        const userSnapshot = await userRef.get().toPromise();
  
        if (!userSnapshot?.empty) {
          const usuario = userSnapshot?.docs[0].data() as Usuario;
  
          if (usuario.tipo === 'admin') {
            this.router.navigate(['/admin']);
          } else if (usuario.tipo === 'alumno') {
            this.router.navigate(['/alumnos']);
          } else if (usuario.tipo === 'profesor') {
            this.router.navigate(['/profe']);
          }
        } else {
          await this.authservice.logout();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Correo no registrado.',
            confirmButtonText: 'OK',
            heightAuto: false
          });
        }
      } else {
        await this.authservice.logout();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Correo no permitido.',
          confirmButtonText: 'OK',
          heightAuto: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al iniciar sesión.',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    } finally {
      await loading.dismiss();
    }
  }

  async res() {
    const loading = await this.loadingController.create({
      message: 'Cargando.....',
      duration: 1000
    });
    await loading.present();
    this.router.navigate(['restablecer']);
  }
}
