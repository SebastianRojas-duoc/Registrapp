import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearCarreraPageRoutingModule } from './crear-carrera-routing.module';

import { CrearCarreraPage } from './crear-carrera.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearCarreraPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CrearCarreraPage]
})
export class CrearCarreraPageModule {}
