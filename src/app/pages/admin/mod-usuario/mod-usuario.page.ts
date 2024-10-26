import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mod-usuario',
  templateUrl: './mod-usuario.page.html',
  styleUrls: ['./mod-usuario.page.scss'],
})
export class ModUsuarioPage implements OnInit {

  editUserForm: FormGroup;
  uid: string='';

  constructor(
    private activatedRoute: ActivatedRoute,
    private usuariosService: UsuariosService,
    private formbuilder:FormBuilder,
    private firestore: AngularFirestore
  ) { 
    this.editUserForm=this.formbuilder.group({
      email: ['',[Validators.required, Validators.email]],
      nombre: ['',[Validators.required]],
      pass: ['',[Validators.required]],
      tipo: ['',[Validators.required]],
      enabled: [true]
    });
  }

  ngOnInit() {
    this.uid = this.activatedRoute.snapshot.paramMap.get('uid') as string;
    this.loadData();
  }

  loadData(){
    this.firestore.collection('usuarios').doc(this.uid).get().toPromise().then((user)=>{
      if (user) {
        const userData = user?.data() as Usuario;
        this.editUserForm?.patchValue({
          email: userData.email,
          nombre: userData.nombre,
          tipo: userData.tipo,
          enabled: userData.enabled 
        });
      }
    });
  }

  async updateUser(){
    await this.firestore.collection('usuarios').doc(this.uid).update(this.editUserForm?.value).then(()=>{
      Swal.fire({
        icon: 'success',
        title: 'Usuario Actualizado',
        text: 'El usuario ha sido modificado correctamente.',
        confirmButtonText: 'OK',
        heightAuto: false
      });
      console.log("Usuario actualizado");
    })
    .catch(()=>{
      console.log("Error al actualizar el usuario");
    });
  }
}
