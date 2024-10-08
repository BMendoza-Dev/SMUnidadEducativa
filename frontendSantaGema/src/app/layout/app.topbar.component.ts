import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AdminService } from '../SantaGema/service/admin.service';
import { MessageService } from 'primeng/api';
import { appConfig } from '../config';
import { Table } from 'primeng/table';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  providers: [MessageService]
})
export class AppTopBarComponent implements AfterViewInit, OnInit {

  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  consultarUsuarios = false;
  cols: any[] = [];
  rowsInit = appConfig.rowsInit;
  globalFilterFields: any[] = [];
  usuariosDB: any[] = [];
  rowsPerPageOptions = appConfig.rowsPerPageOptions;
  consultarUsuariosDB = false;
  nombre = '';
  usuarios: any[] = [];

  constructor(public layoutService: LayoutService, private adminService: AdminService, private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {

    this.cols = [
      { field: 'cedula', header: 'Número de cédula', type: 'text', maxWidth: '20%' },
      { field: 'apellidos', header: 'Apellidos', type: 'text', maxWidth: '30%' },
      { field: 'nombres', header: 'Nombres', type: 'text', maxWidth: '30%' },
    ];

    this.globalFilterFields = this.generateGlobalFilterFields();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  generateGlobalFilterFields(): string[] {
    return this.cols
      .filter(col => col.type === 'text')
      .map(col => col.field);
  }

  consultarDB() {
    this.consultarUsuariosDB = true;
    this.spinner.show();
    this.adminService.getListUsuario().subscribe({
      next: rest => {
        this.usuariosDB = rest['message'];
        this.spinner.hide();
      }, error: e => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'No hay conexión a la base de datos', life: 2000 });
      }
    })
  }

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

  consultarUsuario() {
    if (this.nombre != '') {
      this.adminService.getSRI(this.nombre.toLocaleUpperCase()).subscribe({
        next: rest => {
          rest.forEach(usuario => {
            this.usuarios.push(usuario);
          });
        }, error: e => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'No existen registro con esos datos', life: 2000 });
        }
      })
    } else {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Alerta!', detail: 'Existe campos vacios', life: 2000 });
    }
  }

  limpiarDatos() {
    this.usuarios = [];
  }
}
