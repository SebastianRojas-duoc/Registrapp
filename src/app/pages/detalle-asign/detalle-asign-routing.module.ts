import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleAsignPage } from './detalle-asign.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleAsignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleAsignPageRoutingModule {}
