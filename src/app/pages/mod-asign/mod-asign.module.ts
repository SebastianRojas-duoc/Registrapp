import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModAsignPageRoutingModule } from './mod-asign-routing.module';

import { ModAsignPage } from './mod-asign.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModAsignPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModAsignPage]
})
export class ModAsignPageModule {}
