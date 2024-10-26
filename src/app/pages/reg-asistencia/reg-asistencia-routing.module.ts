import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegAsistenciaPage } from './reg-asistencia.page';

const routes: Routes = [
  {
    path: '',
    component: RegAsistenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegAsistenciaPageRoutingModule {}
