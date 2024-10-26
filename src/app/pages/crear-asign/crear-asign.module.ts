import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearAsignPageRoutingModule } from './crear-asign-routing.module';

import { CrearAsignPage } from './crear-asign.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearAsignPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CrearAsignPage]
})
export class CrearAsignPageModule {}
