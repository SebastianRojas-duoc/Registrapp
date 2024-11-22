import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splashscreen',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'splashscreen',
    loadChildren: () => import('./pages/splashscreen/splashscreen.module').then( m => m.SplashscreenPageModule)
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/admin/dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
      {
        path: ':uid',
        loadChildren: () => import('./pages/admin/mod-usuario/mod-usuario.module').then( m => m.DetalleUsuarioPageModule)
      }
    ]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'asign',
    loadChildren: () => import('./pages/asign/asign.module').then( m => m.AsignPageModule)
  },
  {
    path: 'alumnos',
    loadChildren: () => import('./pages/alumnos/alumnos.module').then( m => m.AlumnosPageModule)
  },
  {
    path: 'profe',
    loadChildren: () => import('./pages/profe/profe.module').then( m => m.ProfePageModule)
  },
  {
    path: 'restablecer',
    loadChildren: () => import('./pages/restablecer/restablecer.module').then( m => m.RestablecerPageModule)
  },
  {
    path: 'crear-asign',
    loadChildren: () => import('./pages/crear-asign/crear-asign.module').then( m => m.CrearAsignPageModule)
  },
  {
    path: 'mod-asign/:id',
    loadChildren: () => import('./pages/mod-asign/mod-asign.module').then( m => m.ModAsignPageModule)
  },
  {
    path: 'crear-carrera',
    loadChildren: () => import('./pages/crear-carrera/crear-carrera.module').then( m => m.CrearCarreraPageModule)
  },
  {
    path: 'mod-carrera/:id',
    loadChildren: () => import('./pages/mod-carrera/mod-carrera.module').then( m => m.ModCarreraPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'reg-asistencia',
    loadChildren: () => import('./pages/reg-asistencia/reg-asistencia.module').then( m => m.RegAsistenciaPageModule)
  },
  {
    path: 'detalle-asign/:id',
    loadChildren: () => import('./pages/detalle-asign/detalle-asign.module').then( m => m.DetalleAsignPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
