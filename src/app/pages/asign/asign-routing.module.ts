import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignPage } from './asign.page';

const routes: Routes = [
  {
    path: '',
    component: AsignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignPageRoutingModule {}
