import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlumnosPage } from './alumnos.page';
import { AlumnosPageRoutingModule } from './alumnos-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlumnosPageRoutingModule
  ],
  declarations: [AlumnosPage]
})
export class AlumnosPageModule {}
