import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ALectivoComponent } from './alectivo.component';


@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: ALectivoComponent }])],
  exports: [RouterModule]
})
export class ALectivoRoutingModule { }
