import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleUsuarioPageRoutingModule } from './mod-usuario-routing.module';

import { ModUsuarioPage } from './mod-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleUsuarioPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModUsuarioPage]
})
export class DetalleUsuarioPageModule {}
