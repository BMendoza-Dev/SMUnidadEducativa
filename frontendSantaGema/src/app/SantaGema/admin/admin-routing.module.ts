import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CursosComponent } from './cursos/cursos.component';
import { ALectivoComponent } from './alectivo/alectivo.component';
import { MateriasComponent } from './materias/materias.component';
import { GestionAlectivosComponent } from './gestion-alectivos/gestion-alectivos.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'Matriculas', data: { breadcrumb: 'Button' }, loadChildren: () => import('./matriculas/matriculas.module').then(m => m.MatriculasModule)},
    { path: 'ALectivo', data: { breadcrumb: 'Button' }, component:ALectivoComponent},
    { path: 'Materias', data: { breadcrumb: 'Button' }, component: MateriasComponent},
    { path: 'Cursos', data: { breadcrumb: 'Button' }, component:CursosComponent},
    { path: 'Usuarios', data: { breadcrumb: 'Button' }, component:UsuariosComponent},
    {path: 'GestionALectivos', data: { breadcrumb: 'Button' }, component:GestionAlectivosComponent}
  ])],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
