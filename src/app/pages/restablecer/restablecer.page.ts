import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import {  MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage implements OnInit {
  
  restablecerForm: FormGroup;
  email: string='';

  constructor(private authService:AuthService,public menuCtrl: MenuController,private router: Router, private alertController: AlertController, private loadingController: LoadingController, private formBuilder: FormBuilder) { 
    this.restablecerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    
  }

  async rest(){
    try {
      const email = this.restablecerForm.value.email;
  
      Swal.fire({
        title: "Procesando",
        html: "Enviando correo...",
        timer: 1000,
        timerProgressBar: true,
        heightAuto: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const userExists = await this.authService.ExisteUser(email);
      console.log('Usuario existe:', userExists);
      if (userExists) {
        await this.authService.recoveryPassword(email);
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Se ha enviado un correo para restablecer la contraseña!',
          confirmButtonText: 'OK',
          heightAuto: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Este correo no está registrado!',
          confirmButtonText: 'OK',
          heightAuto: false
        });
        return;
      }
    } catch (error: any) {
      let errorMessage = "Hubo un problema al enviar el correo!";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Este correo no está registrado...!";
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

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
}
