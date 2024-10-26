import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegAsistenciaPageRoutingModule } from './reg-asistencia-routing.module';

import { RegAsistenciaPage } from './reg-asistencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegAsistenciaPageRoutingModule
  ],
  declarations: [RegAsistenciaPage]
})
export class RegAsistenciaPageModule {}
