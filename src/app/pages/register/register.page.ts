import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import Swal from 'sweetalert2';
import { RandomUserService } from 'src/app/services/randomuser.service'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  loginForm: FormGroup;
  emailValue: string = '';
  passValue: string = '';
  nombreValue: string='';

  constructor(
    private router: Router, 
    private loadingController: LoadingController, 
    private alertController: AlertController, 
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usuariosServices: UsuariosService,
    private menuController: MenuController,
    private firestore: AngularFirestore,
    private randomUserService: RandomUserService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.menuController.enable(false);
  }

  async registrarse() {
    try {
      const loading = await this.loadingController.create({
        message: 'Registrando...',
        duration: 500,
      });
      await loading.present();

      if (this.emailValue.endsWith('@duocuc.cl') || this.emailValue.endsWith('@profesor.duoc.cl') || this.emailValue.endsWith('@admin.cl')) {
        
        const aux = await this.authService.register(this.emailValue, this.passValue);
        const user = aux.user;

        if (user) {
          let userType = 'alumno';

          if (user.email?.endsWith('@duocuc.cl')) {
            userType = 'alumno';
          } else if (user.email?.endsWith('@profesor.duoc.cl')) {
            userType = 'profesor';
          } else if (user.email?.endsWith('@admin.cl')) {
            userType = 'admin';
          }

          if (userType !== '') {
            await this.firestore.collection('usuarios').doc(user.uid).set({
              uid: user.uid,
              nombre: this.nombreValue,
              email: user.email,
              pass: this.passValue,
              tipo: userType,
              enabled: true 
            });

            if(userType=='alumno'){
              await this.firestore.collection('alumnos').doc(user.uid).set({
                uid: user.uid,
                nombre: this.nombreValue,
                email: user.email,
                pass: this.passValue,
                tipo: userType,
                enabled: true,
                asign:[]
              });
            }else if(userType=='profesor'){
              await this.firestore.collection('profesores').doc(user.uid).set({
                uid: user.uid,
                nombre: this.nombreValue,
                email: user.email,
                pass: this.passValue,
                tipo: userType,
                enabled: true,
                asign:[]
              });
            }

            await loading.dismiss();
            Swal.fire({
              icon: 'success',
              title: 'Registro Exitoso',
              text: 'Usuario registrado correctamente',
              confirmButtonText: 'OK',
              heightAuto: false
            }).then(() => {
              this.router.navigate(['/login']);
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ingrese correo Duoc válido.',
              confirmButtonText: 'OK',
              heightAuto: false
            });
            this.emailValue = '';
            this.passValue = '';
            this.nombreValue = '';
          }
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al registrar el usuario.',
          confirmButtonText: 'OK',
          heightAuto: false
        });
      }
      
    } catch (error: any) {
      let errorMessage = "Hubo un problema al registrar el usuario!";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Este correo no está registrado!";
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }

  async registrarUsuariosAleatorios() {
    const loading = await this.loadingController.create({
      message: 'Registrando usuarios...',
      duration: 1000,
    });
    
    try {
      await loading.present();

      const response: any = await this.randomUserService.getRandomUsers(10).toPromise();
      const usuarios = response.results;

      const alumnos = usuarios.slice(0, 5);
      const profesores = usuarios.slice(5, 10);

      const password = 'qwe123'; 

      for (let alumno of alumnos) {
        const email = `${alumno.login.username}@duocuc.cl`;
        await this.registrarUsuario(alumno, email, password, 'alumno');
      }

      for (let profesor of profesores) {
        const email = `${profesor.login.username}@profesor.duoc.cl`;
        await this.registrarUsuario(profesor, email, password, 'profesor');
      }

      await loading.dismiss();
      Swal.fire({
        icon: 'success',
        title: 'Usuarios registrados',
        text: '10 usuarios (5 alumnos y 5 profesores) han sido registrados.',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      await loading.dismiss();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al registrar los usuarios.',
        confirmButtonText: 'OK',
      });
    }
  }

  async registrarUsuario(userData: any, email: string, password: string, tipo: string) {
    const result = await this.authService.register(email, password);
    const user = result.user;

    if (user) {
      await this.firestore.collection('usuarios').doc(user.uid).set({
        uid: user.uid,
        nombre: userData.name.first + ' ' + userData.name.last,
        email: email,
        pass: password,
        tipo: tipo,
        enabled: true
      });

      const userCollection = tipo === 'alumno' ? 'alumnos' : 'profesores';
      await this.firestore.collection(userCollection).doc(user.uid).set({
        uid: user.uid,
        nombre: userData.name.first + ' ' + userData.name.last,
        email: email,
        pass: password,
        tipo: tipo,
        enabled: true,
        asign: []
      });
    }
  }
}
