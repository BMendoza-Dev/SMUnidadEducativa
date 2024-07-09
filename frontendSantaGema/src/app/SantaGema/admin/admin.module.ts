import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ALectivoComponent } from './alectivo/alectivo.component';
import { CursosComponent } from './cursos/cursos.component';


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
