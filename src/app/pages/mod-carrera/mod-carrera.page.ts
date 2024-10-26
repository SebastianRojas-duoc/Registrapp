import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Carrera } from 'src/app/interfaces/carrera';
import firebase from 'firebase/compat/app';  

@Component({
  selector: 'app-mod-carrera',
  templateUrl: './mod-carrera.page.html',
  styleUrls: ['./mod-carrera.page.scss'],
})
export class ModCarreraPage implements OnInit {
  
  editCarreraForm: FormGroup;
  carreraId: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private router: Router
  ) { 
    this.editCarreraForm = this.formBuilder.group({
      nombre: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.carreraId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.loadData();
  }

  loadData() {
    this.firestore.collection('carreras').doc(this.carreraId).get().toPromise()
      .then((carreraDoc) => {
        if (carreraDoc?.exists) {
          const carreraData = carreraDoc.data() as Carrera;
          this.editCarreraForm.patchValue({
            nombre: carreraData?.nombre 
          });
        } else {
          this.showError('La carrera no existe.');
        }
      })
      .catch(() => {
        this.showError('Hubo un error al cargar la carrera.');
      });
  }

  async updateCarrera() {
    if (this.editCarreraForm.valid) {
      try {
        await this.firestore.collection('carreras').doc(this.carreraId).update(this.editCarreraForm.value);
        Swal.fire({
          icon: 'success',
          title: 'Carrera Actualizada',
          text: 'La carrera ha sido modificada correctamente.',
          confirmButtonText: 'OK',
          heightAuto: false
        });
        this.router.navigate(['/admin']);
      } catch {
        this.showError('Hubo un error al actualizar la carrera.');
      }
    } else {
      this.showError('Por favor, completa todos los campos.');
    }
  }

  private showError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonText: 'OK',
      heightAuto: false
    });
  }

  async eliminarCarrera() {
    const confirmDelete = await Swal.fire({
      icon: 'warning',
      title: 'Eliminar Carrera',
      text: '¿Estás seguro de que deseas eliminar esta carrera?',
      showCancelButton: true,
      heightAuto: false,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        const carreraDoc = await this.firestore.collection('carreras').doc(this.carreraId).get().toPromise();
        if (carreraDoc?.exists) {
          const carreraData = carreraDoc.data() as Carrera;
  
          await this.firestore.collection('carreras').doc(this.carreraId).delete();
  
          const asignaturas = carreraData.asignaturas || [];
  
          if (Array.isArray(asignaturas) && asignaturas.length > 0) {
            const alumnosSnapshot = await this.firestore.collection('alumnos', ref => ref.where('carreraId', '==', this.carreraId)).get().toPromise();
  
            alumnosSnapshot?.forEach(async (alumnoDoc) => {
              await this.firestore.collection('alumnos').doc(alumnoDoc.id).update({
                asignaturas: firebase.firestore.FieldValue.arrayRemove(...asignaturas)
              });
            });
          }
  
          Swal.fire({
            icon: 'success',
            title: 'Carrera Eliminada',
            text: 'La carrera ha sido eliminada correctamente.',
            confirmButtonText: 'OK',
            heightAuto: false
          }).then(() => {
            this.router.navigate(['/admin']);
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al eliminar la carrera.',
          confirmButtonText: 'OK',
          heightAuto: false
        });
      }
    }
  }
  
}
