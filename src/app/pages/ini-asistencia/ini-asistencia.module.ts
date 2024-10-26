import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IniAsistenciaPageRoutingModule } from './ini-asistencia-routing.module';

import { IniAsistenciaPage } from './ini-asistencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IniAsistenciaPageRoutingModule
  ],
  declarations: [IniAsistenciaPage]
})
export class IniAsistenciaPageModule {}
