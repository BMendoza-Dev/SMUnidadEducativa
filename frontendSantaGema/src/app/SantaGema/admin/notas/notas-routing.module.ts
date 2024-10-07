import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionNotasComponent } from './gestion-notas/gestion-notas.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'registrar-notas', data: { breadcrumb: 'Button' }, component:GestionNotasComponent},
    { path: '**', redirectTo: '/admin/Matriculas' },
  ])],
  exports: [RouterModule]
})
export class NotasRoutingModule { }
