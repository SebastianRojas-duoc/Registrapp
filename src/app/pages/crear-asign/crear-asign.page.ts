import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import firebase from 'firebase/compat/app';  

@Component({
  selector: 'app-crear-asign',
  templateUrl: './crear-asign.page.html',
  styleUrls: ['./crear-asign.page.scss'],
})
export class CrearAsignPage implements OnInit {

  crearAsignForm: FormGroup;
  carreras: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.crearAsignForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      seccion: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      carrera: ['', [Validators.required]] 
    });
  }

  ngOnInit() {
    this.cargarCarreras();
  }

  cargarCarreras() {
    this.firestore.collection('carreras').valueChanges().subscribe((carreras: any[]) => {
      this.carreras = carreras;
    });
  }

  async crearAsignatura() {
    if (this.crearAsignForm.valid) {
      const nuevaAsignatura = this.crearAsignForm.value;
  
      try {
        const nuevoId = this.firestore.createId();
  
        await this.firestore.collection('asignaturas').doc(nuevoId).set({
          id: nuevoId, 
          nombre: nuevaAsignatura.nombre,
          seccion: nuevaAsignatura.seccion,
          descripcion: nuevaAsignatura.descripcion,
        });
  
        await this.firestore.collection('carreras').doc(nuevaAsignatura.carrera).update({
          asignaturas: firebase.firestore.FieldValue.arrayUnion({
            id: nuevoId,
            nombre: nuevaAsignatura.nombre,
            seccion: nuevaAsignatura.seccion,
            descripcion: nuevaAsignatura.descripcion
          })
        });
  
        Swal.fire({
          icon: 'success',
          title: 'Asignatura Creada',
          text: 'La asignatura se ha creado correctamente.',
          confirmButtonText: 'OK',
          heightAuto: false
        }).then(() => {
          this.router.navigate(['/admin']);
        });
      } catch (error) {
        console.error('Error al crear la asignatura: ', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al crear la asignatura.',
          confirmButtonText: 'OK',
          heightAuto: false
        });
      }
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
