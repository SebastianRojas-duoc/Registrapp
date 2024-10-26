import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-carrera',
  templateUrl: './crear-carrera.page.html',
  styleUrls: ['./crear-carrera.page.scss'],
})
export class CrearCarreraPage {

  crearCarreraForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private router:Router
  ) {
    this.crearCarreraForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
    });
  }

  async crearCarrera() {
    if (this.crearCarreraForm.valid) {
      const carreraData = this.crearCarreraForm.value;

      const docRef = await this.firestore.collection('carreras').add(carreraData);
      
      await docRef.update({ id: docRef.id });

      Swal.fire({
        icon: 'success',
        title: 'Carrera Creada',
        text: 'La carrera ha sido creada correctamente.',
        confirmButtonText: 'OK',
        heightAuto: false
      });

      this.router.navigate(['/admin']);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario Incompleto',
        text: 'Por favor, completa todos los campos.',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }
}
