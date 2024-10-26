import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

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
    private authservice:AuthService,
    private firestore:AngularFirestore
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required,Validators.minLength(6)]],
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
  async res(){
    const loading = this.loadingController.create({
      message: 'Cargando.....',
      duration: 1000
    });
    (await loading).present();
    this.router.navigate(['restablecer']);
  }
}
