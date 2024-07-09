import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CursosRoutingModule } from './cursos-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CursosComponent } from './cursos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [CursosComponent],
  imports: [
    CommonModule,
    CursosRoutingModule,
    AutoCompleteModule,
	CalendarModule,
	ChipsModule,
	DropdownModule,
	InputMaskModule,
	InputNumberModule,
	CascadeSelectModule,
	MultiSelectModule,
	InputTextareaModule,
	InputTextModule,
	FormsModule,
	ReactiveFormsModule
  ]
})
export class CursosModule { }
