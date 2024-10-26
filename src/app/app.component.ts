import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';
import Swal from 'sweetalert2';

interface AppPage {
  title: string;
  url?: string;
  icon: string;
  action?: () => Promise<void>;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages: AppPage[] = [];
  public tipoUsuario?: string;
  public emailUsuario?: string;
  public isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.isAuthenticated = !!user;
      this.configSideMenu();
    });
  }

  configSideMenu() {
    if (this.isAuthenticated) {
        this.appPages = [
          { title: 'Inicio', url: '/', icon: 'home' },
          { title: 'Perfil', url: '/perfil', icon: 'settings' },
          { title: 'Cerrar Sesión', icon: 'log-out', action: () => this.logout() }
        ];
      
    } else {
      this.appPages = [
        { title: 'Iniciar Sesión', url: '/login', icon: 'log-in' }
      ];
    }
  }

  async logout() {
    const confirmLogout = await Swal.fire({
      title: 'Cerrar Sesión',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar',
      heightAuto: false
    });

    if (confirmLogout.isConfirmed) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
