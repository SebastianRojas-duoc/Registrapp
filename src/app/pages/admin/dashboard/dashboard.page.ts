import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  username?: string | null;
  usuarios: any = [];
  asignaturas: any = [];
  carreras: any = []; 
  usuario?: any;
  nombreUsuario?: string;
  usuariosExpandido: boolean = false; 
  asignaturasExpandido: boolean = false;
  carrerasExpandido: boolean = false;

  constructor(
    private menuController: MenuController,
    private firestore: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.menuController.enable(true);
    this.obtenerUsuarioLogueado();
    this.cargarUsuarios();
    this.cargarAsignaturas();
    this.cargarCarreras(); 
  }

  cargarUsuarios() {
    this.firestore.collection('usuarios').valueChanges().subscribe(aux => {
      this.usuarios = aux;
    });
  }

  cargarAsignaturas() {
    this.firestore.collection('asignaturas').valueChanges().subscribe(aux => {
      this.asignaturas = aux;
    });
  }

  cargarCarreras() {
    this.firestore.collection('carreras').valueChanges().subscribe(aux => {
      this.carreras = aux;
    });
  }

  obtenerUsuarioLogueado() {
    this.authService.getCurrentUser().then(user => {
      if (user) {
        this.firestore.collection('usuarios').doc(user.uid).valueChanges().subscribe((usuario: any) => {
          if (usuario) {
            this.nombreUsuario = usuario.nombre;
          }
        });
      }
    });
  }

  toggleUsuarios() {
    this.usuariosExpandido = !this.usuariosExpandido;
  }

  toggleAsignaturas() {
    this.asignaturasExpandido = !this.asignaturasExpandido;
  }

  toggleCarreras() {
    this.carrerasExpandido = !this.carrerasExpandido;
  }

  crearCarrera() {
    this.router.navigate(['/crear-carrera']); 
  }
}
