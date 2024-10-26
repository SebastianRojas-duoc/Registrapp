import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AsignPage } from './asign.page';
import { AsignaturasService } from '../../services/asignaturas.service';
import { AsignPageRoutingModule } from './asign-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsignPageRoutingModule
  ],
  declarations: [AsignPage],
  providers: [AsignaturasService]
})
export class AsignPageModule {}
