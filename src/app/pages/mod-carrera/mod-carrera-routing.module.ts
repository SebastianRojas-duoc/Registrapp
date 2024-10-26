import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModCarreraPage } from './mod-carrera.page';

const routes: Routes = [
  {
    path: '',
    component: ModCarreraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModCarreraPageRoutingModule {}
