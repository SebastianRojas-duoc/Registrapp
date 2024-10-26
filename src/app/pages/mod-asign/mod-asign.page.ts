import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Asignatura } from 'src/app/interfaces/asignatura'; 
import Swal from 'sweetalert2';
import firebase from 'firebase/compat/app';  

@Component({
  selector: 'app-mod-asign',
  templateUrl: './mod-asign.page.html',
  styleUrls: ['./mod-asign.page.scss'],
})
export class ModAsignPage implements OnInit {

  editAsignForm: FormGroup;
  asignaturaId: string = ''; 
  carreras: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private router:Router
  ) { 
    this.editAsignForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      seccion: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      carrera: ['', [Validators.required]] 
    });
  }

  ngOnInit() {
    this.asignaturaId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.loadData();
    this.loadCarreras();
  }

  loadData() {
    this.firestore.collection('asignaturas').doc(this.asignaturaId).get().toPromise()
      .then((asignaturaDoc) => {
        if (asignaturaDoc?.exists) {
          const asignaturaData = asignaturaDoc.data() as Asignatura; 
          this.editAsignForm.patchValue({
            nombre: asignaturaData.nombre,
            seccion: asignaturaData.seccion,
            descripcion: asignaturaData.descripcion,
            carrera: asignaturaData.carrera
          });
        } else {
          this.showError('La asignatura no existe.');
        }
      })
      .catch(() => {
        this.showError('Hubo un error al cargar la asignatura.');
      });
  }

  loadCarreras() {
    this.firestore.collection('carreras').valueChanges().subscribe(carreras => {
      this.carreras = carreras;
    });
  }

  async updateAsignatura() {
    if (this.editAsignForm.valid) {
      try {
        await this.firestore.collection('asignaturas').doc(this.asignaturaId).update(this.editAsignForm.value);
        Swal.fire({
          icon: 'success',
          title: 'Asignatura Actualizada',
          text: 'La asignatura ha sido modificada correctamente.',
          confirmButtonText: 'OK',
          heightAuto: false
        });
        
        this.router.navigate(['/admin']);
      } catch {
        this.showError('Hubo un error al actualizar la asignatura.');
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
  async eliminarAsignatura() {
    const confirmDelete = await Swal.fire({
      icon: 'warning',
      title: 'Eliminar Asignatura',
      text: '¿Estás seguro de que deseas eliminar esta asignatura?',
      showCancelButton: true,
      heightAuto: false,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        const asignaturaDoc = await this.firestore.collection('asignaturas').doc(this.asignaturaId).get().toPromise();
        if (asignaturaDoc?.exists) {
          const asignaturaData = asignaturaDoc.data() as Asignatura;
          const carreraId = asignaturaData.carrera; 
  
          await this.firestore.collection('asignaturas').doc(this.asignaturaId).delete();
  
          await this.firestore.collection('carreras').doc(carreraId).update({
            asignaturas: firebase.firestore.FieldValue.arrayRemove({
              id: this.asignaturaId,
              nombre: asignaturaData.nombre,
              seccion: asignaturaData.seccion,
              descripcion: asignaturaData.descripcion
            })
          });
  
          Swal.fire({
            icon: 'success',
            title: 'Asignatura Eliminada',
            text: 'La asignatura ha sido eliminada correctamente.',
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
          text: 'Hubo un error al eliminar la asignatura.',
          confirmButtonText: 'OK',
          heightAuto: false
        });
      }
    }
  }
  

}
