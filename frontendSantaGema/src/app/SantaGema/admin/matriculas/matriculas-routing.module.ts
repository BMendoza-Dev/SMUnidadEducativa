import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearMatriculaComponent } from './crear-matricula/crear-matricula.component';
import { ListMatriculaComponent } from './list-matricula/list-matricula.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'crear-matricula', data: { breadcrumb: 'Button' }, component:CrearMatriculaComponent},
    { path: 'lista-matricula', data: { breadcrumb: 'Button' }, component: ListMatriculaComponent},
    { path: '**', redirectTo: '/admin/Matriculas' },
  ])],
  exports: [RouterModule]
})
export class MatriculasRoutingModule { }
