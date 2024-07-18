import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'ALectivo', data: { breadcrumb: 'Button' }, loadChildren: () => import('./alectivo/alectivo.module').then(m => m.ALectivoModule)},
    { path: 'Cursos', data: { breadcrumb: 'Button' }, loadChildren: () => import('./cursos/cursos.module').then(m => m.CursosModule)},
    { path: 'Usuarios', data: { breadcrumb: 'Button' }, loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule)},
  ])],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
