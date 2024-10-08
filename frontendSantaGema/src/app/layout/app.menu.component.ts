import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Administrador',
                items: [
                    {
                        label: 'Administración', icon: 'pi pi-fw pi-cog',
                        items: [
                            {
                                label: 'Materias', icon: 'pi pi-fw pi-book', routerLink: ['/admin/Materias'],
                            },
                            {
                                label: 'Cursos', icon: 'pi pi-fw pi-calendar', routerLink: ['/admin/Cursos'],
                            },
                            {
                                label: 'Año Lectivo', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/admin/ALectivo'],
                            },
                            {
                                label: 'Gestión Años Lectivos', icon: 'pi pi-fw pi-flag', routerLink: ['/admin/GestionALectivos'],
                            }
                        ]
                    },
                    { label: 'Gestión Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/admin/Usuarios'] },
                    {
                        label: 'Gestión Matrículas', icon: 'pi pi-fw pi-pencil',
                        items: [
                            {
                                label: 'Registro Matrículas', icon: 'pi pi-fw pi-plus', routerLink: ['/admin/Matriculas/crear-matricula'],
                            },
                            {
                                label: 'Lista Matrículas', icon: 'pi pi-fw pi-list', routerLink: ['/admin/Matriculas/lista-matricula'],
                            }
                        ]
                    },
                    {
                        label: 'Gestión Notas', icon: 'pi pi-fw pi-star',
                        items: [
                            {
                                label: 'Registro de notas', icon: 'pi pi-fw pi-check', routerLink: ['/admin/GestionNotas/registrar-notas'],
                            }
                        ]
                    }
                ],
            }
        ];
    }
}
