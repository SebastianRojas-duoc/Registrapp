import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModCarreraPageRoutingModule } from './mod-carrera-routing.module';

import { ModCarreraPage } from './mod-carrera.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModCarreraPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModCarreraPage]
})
export class ModCarreraPageModule {}
