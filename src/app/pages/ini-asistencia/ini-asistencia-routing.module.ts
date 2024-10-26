import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IniAsistenciaPage } from './ini-asistencia.page';

const routes: Routes = [
  {
    path: '',
    component: IniAsistenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IniAsistenciaPageRoutingModule {}
