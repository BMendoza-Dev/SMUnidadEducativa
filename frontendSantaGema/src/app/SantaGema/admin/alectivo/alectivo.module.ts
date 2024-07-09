import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ALectivoRoutingModule } from './alectivo-routing.module';

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
import { FormsModule } from '@angular/forms';
import { ALectivoComponent } from './alectivo.component';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@NgModule({
  declarations: [ALectivoComponent],
  imports: [
    CommonModule,
		FormsModule,
    ALectivoRoutingModule,
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
		TableModule,
		RatingModule,
		ButtonModule,
		SliderModule,
		ToggleButtonModule,
		RippleModule,
		ProgressBarModule,
		ToastModule,
		SplitButtonModule,

		FileUploadModule,
        ToolbarModule,
        RadioButtonModule,
        DialogModule,

		MessagesModule,
		MessageModule,
  ],
})
export class ALectivoModule { }
