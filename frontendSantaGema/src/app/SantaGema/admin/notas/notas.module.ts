import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotasRoutingModule } from './notas-routing.module';
import { GestionNotasComponent } from './gestion-notas/gestion-notas.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
  declarations: [
    GestionNotasComponent
  ],
  imports: [
    CommonModule,
    NotasRoutingModule,
    AutoCompleteModule,
    ButtonModule,
    FormsModule,
    NgxSpinnerModule,
    ToastModule,
    TableModule,
    InputTextModule,
    SharedPipesModule,
    DialogModule,
    ReactiveFormsModule,
    TooltipModule
  ]
})
export class NotasModule { }
