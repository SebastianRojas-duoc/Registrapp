import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModAsignPage } from './mod-asign.page';

const routes: Routes = [
  {
    path: '',
    component: ModAsignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModAsignPageRoutingModule {}
