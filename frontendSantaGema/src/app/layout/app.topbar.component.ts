import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AdminService } from '../SantaGema/service/admin.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  providers:[MessageService]
})
export class AppTopBarComponent implements AfterViewInit {

  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  consultarUsuarios = false;
  nombre = '';
  usuarios: any[] = [];

  constructor(public layoutService: LayoutService, private adminService:AdminService, private messageService: MessageService) {}

  ngAfterViewInit() {
    // Verificar si los elementos han sido inicializados antes de acceder a ellos
    if (this.menuButton && this.menuButton.nativeElement) {
      console.log('menuButton:', this.menuButton.nativeElement);
    } else {
      console.warn('menuButton no está disponible');
    }

    if (this.topbarMenuButton && this.topbarMenuButton.nativeElement) {
      console.log('topbarMenuButton:', this.topbarMenuButton.nativeElement);
    } else {
      console.warn('topbarMenuButton no está disponible');
    }

    if (this.menu && this.menu.nativeElement) {
      console.log('menu:', this.menu.nativeElement);
    } else {
      console.warn('menu no está disponible');
    }
  }

  consultarUsuario(){
    if(this.nombre != ''){
      this.adminService.getSRI(this.nombre.toLocaleUpperCase()).subscribe({
        next:rest => {
          this.usuarios = rest;
        },error:e => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'No existen registro con esos datos',life:2000 });
        }
      })
    }else{
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Alerta!', detail: 'Existe campos vacios', life:2000});
    }
  }
}
