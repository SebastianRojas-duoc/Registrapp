import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearCarreraPage } from './crear-carrera.page';

const routes: Routes = [
  {
    path: '',
    component: CrearCarreraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearCarreraPageRoutingModule {}
