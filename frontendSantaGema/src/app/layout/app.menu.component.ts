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
                        label: 'Administración', icon: 'pi pi-fw pi-file-edit',
                        items: [
                            {
                                label: 'Materias', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/Materias'],
                            },
                            {
                                label: 'Cursos', icon: 'pi pi-fw pi-list', routerLink: ['/admin/Cursos'],
                            },
                            {
                                label: 'Año Lectivo', icon: 'pi pi-fw pi-sitemap', routerLink: ['/admin/ALectivo'],
                            },
                            {
                                label: 'Gestión Años Lectivos', icon: 'pi pi-fw pi-folder', routerLink: ['/admin/GestionALectivos'],
                            }
                        ]
                    },
                    { label: 'Gestión Usuarios', icon: 'pi pi-fw pi-user-plus', routerLink: ['/admin/Usuarios'] },
                    {
                        label: 'Gestión Matrículas', icon: 'pi pi-fw pi-file-edit',
                        items: [
                            {
                                label: 'Registro Matrículas', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/Matriculas/crear-matricula'],
                            },
                            {
                                label: 'Lista Matrículas', icon: 'pi pi-fw pi-list', routerLink: ['/admin/Matriculas/lista-matricula'],
                            }
                        ]
                    }
                ],
            }
        ];
    }
}
