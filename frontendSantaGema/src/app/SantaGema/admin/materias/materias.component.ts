import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { MessageService } from 'primeng/api';
import { Materia } from '../../service/interface';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.scss'],
  providers: [MessageService]
})
export class MateriasComponent {

  constructor(private adminService: AdminService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.adminService.getListMateria().subscribe({
      next: data => {
        this.materias = data['message'];

        this.cols = [
          { field: 'id', header: 'ID' },
          { field: 'nombre', header: 'Nombre' },
        ];
      }
    })
  }

  //CRUD

  nomMateria: any = "";

  clearVariable() {
    this.nomMateria = "";
    this.validatedForm = false;
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

  rowsPerPageOptions = [5, 10, 20];

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
      if (this.materia.nombre != "") {
        this.materias[this.findIndexById(this.materia.id)] = this.materia;
        this.adminService.updateMateria(this.materia).subscribe({
          next: rest => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Materia actualizado', life: 3000 });
            this.materias = [...this.materias];
            this.materiaDialog = false;
            this.materia = {};
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
      this.materia = {
        nombre: this.nomMateria,
      }

      if (this.materia.nombre != "") {
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
              window.location.reload();
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
