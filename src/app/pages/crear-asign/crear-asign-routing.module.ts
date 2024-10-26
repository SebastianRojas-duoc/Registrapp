import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearAsignPage } from './crear-asign.page';

const routes: Routes = [
  {
    path: '',
    component: CrearAsignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearAsignPageRoutingModule {}
