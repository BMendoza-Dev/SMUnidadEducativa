import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { MessageService } from 'primeng/api';
import { Materia } from '../../service/interface';
import { Table } from 'primeng/table';
import { appConfig } from 'src/app/config';

@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.scss'],
  providers: [MessageService]
})
export class MateriasComponent {

  constructor(private adminService: AdminService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'ID', type: 'text', maxWidth: '10%' },
      { field: 'nombre', header: 'Nombre', type: 'text', maxWidth: '30%' },
      { field: 'tipo_nota', header: 'Tipo de Nota', type: 'text', maxWidth: '10%' },
      { field: 'incluye_promedio', header: 'Incluye en promedio', type: 'badge', maxWidth: '10%' },
    ];
    this.globalFilterFields = this.generateGlobalFilterFields();
    this.cargarMaterias();
  }

  generateGlobalFilterFields(): string[] {
    return this.cols
      .filter(col => col.type === 'text')
      .map(col => col.field);
  }

  cargarMaterias() {
    this.adminService.getListMateria().subscribe({
      next: data => {
        this.materias = data['message'];
      }
    })
  }

  nomMateria: any = "";

  clearVariable() {
    this.nomMateria = "";
    this.validatedForm = false;
    this.tipoNota = "";
    this.incluyePromedio = null;
  }

  validatedForm: boolean = false;

  materiaDialog: boolean = false;

  deleteMateriaDialog: boolean = false;

  deleteMateriasDialog: boolean = false;

  materias: Materia[] = [];

  materia: Materia = {};

  selectedMaterias: Materia[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  rowsInit = appConfig.rowsInit;
  rowsPerPageOptions = appConfig.rowsPerPageOptions;
  globalFilterFields: any[] = [];

  tipoNota: string = "";
  incluyePromedio: boolean | null = null;

  tiposNota = [
    { label: 'Cuantitativa', value: 'cuantitativa' },
    { label: 'Cualitativa', value: 'cualitativa' }
  ];

  opcionesPromedio = [
    { label: 'Sí', value: 1 },
    { label: 'No', value: 0 }
  ];



  openNew() {
    this.materia = {};
    this.submitted = false;
    this.materiaDialog = true;
  }

  deleteSelectedMaterias() {
    this.deleteMateriasDialog = true;
  }

  editMateria(materia: Materia) {
    this.materia = { ...materia };
    this.materiaDialog = true;
  }

  deleteMateria(materia: Materia) {
    this.deleteMateriaDialog = true;
    this.materia = { ...materia };
  }

  confirmDelete() {
    this.deleteMateriaDialog = false;
    this.materias = this.materias.filter(val => val.id !== this.materia.id);
    let ids = [
      this.materia.id
    ]
    this.adminService.deleteMateria(ids).subscribe({
      next: rest => {
        if (rest['code'] == "200") {
          this.materia = {};
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Materia eliminado', life: 3000 });
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información' });
        }
      }, error: e => {
        window.location.reload();
        console.log(e);
      }
    })

  }

  confirmDeleteSelected() {
    this.deleteMateriasDialog = false;
    this.selectedMaterias;
    let listaIds = this.selectedMaterias.map(materia => materia.id);
    this.adminService.deleteMateria(listaIds).subscribe({
      next: rest => {
        if (rest['code'] == "200") {
          this.materias = this.materias.filter(val => !this.selectedMaterias.includes(val));
          this.selectedMaterias = [];
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Materias eliminados', life: 3000 });
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información' });
        }

      }, error: e => {
        console.log(e)
      }
    })

  }

  hideDialog() {
    this.materiaDialog = false;
    this.submitted = false;
  }

  saveMateria() {
    this.submitted = true;
    this.validatedForm = true
    if (this.materia.id) {
      if (this.materia.nombre) {
        this.adminService.updateMateria(this.materia).subscribe({
          next: rest => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Materia actualizado', life: 3000 });
            this.materiaDialog = false;
            this.materia = {};
            this.cargarMaterias();
          }, error: e => {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información' });
            setTimeout(() => {
              console.log(e);
            }, 2000);
          }
        })
      } else {
        this.submitted = true;
        this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Alerta!', detail: 'Existe campos vacios' });
      }
    } else {
      if (this.nomMateria && this.tipoNota && this.incluyePromedio !== null) {
        this.materia = {
          nombre: this.nomMateria,
          tipo_nota: this.tipoNota,
          incluye_promedio: this.incluyePromedio
        };
        this.adminService.registerMateria(this.materia).subscribe({
          next: rest => {
            if (rest.code == "200") {
              this.materia.id = rest.id;
              this.materias.push(this.materia);
              this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Se proceso correctamente' });
              this.materias = [...this.materias];
              this.materiaDialog = false;
              this.materia = {};
              this.validatedForm = false;
            } else {
              window.location.reload();
              this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información' });
            }
            this.clearVariable();
          }, error: e => {
            setTimeout(() => {
              console.log(e);
            }, 2000);
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información' });
          }
        })
      } else {
        this.validatedForm = true;
        this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Alerta!', detail: 'Existe campos vacios' });
      }
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.materias.length; i++) {
      if (this.materias[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): number {
    return Math.floor(Math.random() * 1000);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
