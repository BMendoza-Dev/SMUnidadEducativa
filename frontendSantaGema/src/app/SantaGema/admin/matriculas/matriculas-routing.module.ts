import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearMatriculaComponent } from './crear-matricula/crear-matricula.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'crear-matricula', data: { breadcrumb: 'Button' }, component:CrearMatriculaComponent},
  ])],
  exports: [RouterModule]
})
export class MatriculasRoutingModule { }
