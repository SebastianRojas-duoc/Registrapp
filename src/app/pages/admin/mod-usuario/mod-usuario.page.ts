import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Carrera } from 'src/app/interfaces/carrera';
import { Usuario } from 'src/app/interfaces/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mod-usuario',
  templateUrl: './mod-usuario.page.html',
  styleUrls: ['./mod-usuario.page.scss'],
})
export class ModUsuarioPage implements OnInit {
  editUserForm: FormGroup;
  carreras: Carrera[] = [];
  asignaturasCarrera: any[] = [];
  asignaturas: any[] = [];
  uid: string = '';
  userType: string = ''; // Nuevo campo para tipo de usuario

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    private formbuilder: FormBuilder
  ) { 
    this.editUserForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required]],
      pass: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      enabled: [true],
      carrera: [''],
      asignaturas: this.formbuilder.array([]),
    });
  }

  ngOnInit() {
    this.uid = this.activatedRoute.snapshot.paramMap.get('uid') as string;
    this.loadCarreras(); 
    this.loadData();
  }

  async loadData() {
    try {
      const userDoc = await this.firestore.collection('usuarios').doc(this.uid).get().toPromise();
      if (userDoc && userDoc.exists) {
        const userData = userDoc.data() as Usuario;
        this.editUserForm.patchValue({
          email: userData.email,
          nombre: userData.nombre,
          tipo: userData.tipo,
          enabled: userData.enabled,
          carrera: userData.carrera
        });
  
        this.userType = userData.tipo; 
        
        if (this.userType === 'alumno' || this.userType === 'profesor') {
          await this.loadUserDataByType();
        }
  
        const asignArray = this.editUserForm.get('asignaturas') as FormArray;
        asignArray.clear();
      
        if (userData.asignaturas) {
          userData.asignaturas.forEach((asignatura: any) => {
            asignArray.push(this.formbuilder.group({
              id: asignatura.id,
              nombre: asignatura.nombre,
              seccion: asignatura.seccion
            }));
          });
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }

  async loadUserDataByType() {
    try {
      const userCollection = this.userType === 'alumno' ? 'alumnos' : 'profesores';
      const userDoc = await this.firestore.collection(userCollection).doc(this.uid).get().toPromise();

      if (userDoc?.exists) {
        const userData = userDoc.data() as Usuario;
        if (userData) {
          this.editUserForm.patchValue({
            carrera: userData.carrera,
            asign: userData.asignaturas || []
          });

          if (userData.carrera) {
            await this.loadAsignaturas(userData.carrera);
          }
        }
      }
    } catch (error) {
      console.error("Error loading user data from specific collection:", error);
    }
  }

  async loadCarreras() {
    try {
      const carrerasSnapshot = await this.firestore.collection('carreras').get().toPromise();
      this.carreras = carrerasSnapshot?.docs.map(doc => {
        const data = doc.data() as Carrera;
        return { id: doc.id, ...data };
      }) || [];
    } catch (error) {
      console.error("Error loading carreras:", error);
      this.carreras = [];
    }
  }

  async loadAsignaturas(carreraId: string) {
    try {
      const carreraDoc = await this.firestore.collection('carreras').doc(carreraId).get().toPromise();
      if (carreraDoc && carreraDoc.exists) {
        const carreraData = carreraDoc.data() as Carrera || {};
        this.asignaturasCarrera = carreraData.asignaturas || [];
      }
    } catch (error) {
      console.error("Error loading asignaturas for carrera:", error);
      this.asignaturasCarrera = [];
    }
  }

  async updateUser() {
    const formData = this.editUserForm.value;

    try {
      await this.firestore.collection('usuarios').doc(this.uid).update({
        email: formData.email,
        nombre: formData.nombre,
        tipo: formData.tipo,
        enabled: formData.enabled
      });

      if (formData.tipo === 'alumno' || formData.tipo === 'profesor') {
        const userCollection = formData.tipo === 'alumno' ? 'alumnos' : 'profesores';
        await this.firestore.collection(userCollection).doc(this.uid).set({
          email: formData.email,
          nombre: formData.nombre,
          tipo: formData.tipo,
          carrera: formData.carrera,
          asign: formData.asignaturas
        }, { merge: true });
      }

      Swal.fire({
        icon: 'success',
        title: 'Usuario Actualizado',
        text: 'El usuario ha sido modificado correctamente.',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar el usuario.',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }

  onCarreraChange(event: any) {
    const carreraId = event.detail.value;
    this.loadAsignaturas(carreraId);
    this.clearAsignaturas(); 
  
    const asignArray = this.editUserForm.get('asignaturas') as FormArray;
    const selectedAsignaturas = this.asignaturasCarrera.filter(asig =>
      this.editUserForm.value.asign.some((selectedAsig: any) => selectedAsig.id === asig.id)
    );
  
    selectedAsignaturas.forEach(asig => {
      asignArray.push(this.formbuilder.group({
        id: asig.id,
        nombre: asig.nombre,
        seccion: asig.seccion
      }));
    });
  }

  clearAsignaturas() {
    const asignArray = this.editUserForm.get('asignaturas') as FormArray;
    while (asignArray.length) {
      asignArray.removeAt(0);
    }
  }

  get asignFormArray(): FormArray {
    return this.editUserForm.get('asignaturas') as FormArray;
  }

  toggleAsignatura(asignatura: any, isChecked: boolean) {
    const asignArray = this.editUserForm.get('asignaturas') as FormArray;
  
    if (isChecked) {
      asignArray.push(this.formbuilder.group({
        id: asignatura.id,
        nombre: asignatura.nombre,
        seccion: asignatura.seccion
      }));
    } else {
      const index = asignArray.controls.findIndex(ctrl => ctrl.value.id === asignatura.id);
      if (index !== -1) {
        asignArray.removeAt(index);
      }
    }
  }

  isAsignaturaSelected(asignatura: any): boolean {
    const asignArray = this.editUserForm.get('asignaturas') as FormArray;
    return asignArray.controls.some((ctrl: any) => ctrl.value.id === asignatura.id);
  }
}
