import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleAsignPageRoutingModule } from './detalle-asign-routing.module';

import { DetalleAsignPage } from './detalle-asign.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleAsignPageRoutingModule
  ],
  declarations: [DetalleAsignPage]
})
export class DetalleAsignPageModule {}
