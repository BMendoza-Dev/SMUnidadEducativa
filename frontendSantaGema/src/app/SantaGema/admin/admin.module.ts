import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ALectivoComponent } from './alectivo/alectivo.component';
import { CursosComponent } from './cursos/cursos.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { RatingModule } from 'primeng/rating';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { ProgressBarModule } from 'primeng/progressbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { MateriasComponent } from './materias/materias.component';
import { GestionAlectivosComponent } from './gestion-alectivos/gestion-alectivos.component';

@NgModule({
  declarations: [UsuariosComponent, CursosComponent,ALectivoComponent, MateriasComponent, GestionAlectivosComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DropdownModule,
    FormsModule,
    AutoCompleteModule,
		CalendarModule,
		ChipsModule,
		InputMaskModule,
		InputNumberModule,
		CascadeSelectModule,
		MultiSelectModule,
		InputTextareaModule,
		InputTextModule,
    ToastModule,
    ReactiveFormsModule,
    KeyFilterModule,
    DialogModule,
    TableModule,
    ToolbarModule,
    MessagesModule,
		MessageModule,
		RatingModule,
		ButtonModule,
		SliderModule,
		ToggleButtonModule,
		RippleModule,
		ProgressBarModule,
		SplitButtonModule,
		FileUploadModule,
    RadioButtonModule,
    FormsModule
  ]
})
export class AdminModule { }
