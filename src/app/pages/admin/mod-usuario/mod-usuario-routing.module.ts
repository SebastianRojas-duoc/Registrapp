import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModUsuarioPage } from './mod-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: ModUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleUsuarioPageRoutingModule {}
