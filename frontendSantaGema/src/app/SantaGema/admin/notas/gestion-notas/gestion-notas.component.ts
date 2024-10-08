import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Table } from 'primeng/table';
import { appConfig } from 'src/app/config';
import { AdminService } from 'src/app/SantaGema/service/admin.service';
import { ALectivo, Curso } from 'src/app/SantaGema/service/interface';

@Component({
  selector: 'app-gestion-notas',
  templateUrl: './gestion-notas.component.html',
  styleUrls: ['./gestion-notas.component.scss'],
  providers: [MessageService]
})
export class GestionNotasComponent implements OnInit {

  selectedCurso: any = [];
  selectedAlectivo: any;
  filteredCursos: any[] | undefined;
  filteredAnioLectivos: any[] | undefined;
  aniolectivos: ALectivo[] | undefined;
  cursos: Curso[] | undefined;
  matriculas: any[] = [];
  anioCursoText: string = ''
  cols: any[] = [];
  rowsInit = appConfig.rowsInit;
  globalFilterFields: any[] = [];
  rowsPerPageOptions = appConfig.rowsPerPageOptions; 
  agregarNotas: boolean = false;
  notasForm: FormGroup;
  idMatricula = 0;
  materias: any;
  constructor(private fb: FormBuilder, private adminService: AdminService, private messageService: MessageService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'matriculaNum', header: 'Número de Matrícula', type: 'text', maxWidth: '10%' },
      { field: 'estudiante.usuario.cedula', header: 'Cédula', type: 'text', maxWidth: '30%' },
      { field: 'estudiante.usuario.apellidos', header: 'Apellidos', type: 'text', maxWidth: '30%' },
      { field: 'estudiante.usuario.nombres', header: 'Nombres', type: 'text', maxWidth: '30%' },
      { field: 'promedio', header: 'Promedio Final', type: 'text', maxWidth: '10%' }
    ];
    this.globalFilterFields = this.generateGlobalFilterFields();
    this.notasForm = this.fb.group({
      materias: this.fb.array([]) // FormArray para manejar las materias de forma dinámica
    });

    this.cargarAlectivos();
  }

  generateGlobalFilterFields(): string[] {
    return this.cols
      .filter(col => col.type === 'text')
      .map(col => col.field);
  }

  agregarMaterias(notas: any[] = []) {
    const materiasFormArray = this.notasForm.get('materias') as FormArray;
    materiasFormArray.clear();
    this.materias.forEach((materia, index) => {
      const nota = notas.find(n => n.materia_id === materia.id); // Buscar la nota correspondiente
      materiasFormArray.push(
        this.fb.group({
          id: [materia.id],
          nombre: [materia.nombre],
          nota: [nota ? nota.calificacion : '', [Validators.required, Validators.pattern(/^\d{1,2}(\.\d{1,2})?$/)]]
        })
      );
    });
  }

  get materiasFormArray() {
    return this.notasForm.get('materias') as FormArray;
  }

  guardar() {
    if (this.notasForm.valid) {
      console.log(this.notasForm.value);
      this.spinner.show();
      this.adminService.agregarNota(this.idMatricula, this.notasForm.value).subscribe({
        next: rest => {
          if (rest['code'] == 200) {
            this.notasForm.reset();
            this.materiasFormArray.reset();
            this.agregarNotas = false;
            this.messageService.add({ severity: 'success', summary: 'Éxito!', detail: 'Se agregaron las notas correctamente', life: 10000 });
          } else if (rest['code'] == 401) {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'El estudiante ya tiene notas registradas', life: 10000 });
          }
          this.spinner.hide();
          this.cargarMatritulas();
        },
        error: err => {
          this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error al procesar la información', life: 1000 });
        }
      })
    } else {
      this.notasForm.markAllAsTouched();
    }
  }

  cargarAlectivos() {
    this.adminService.getUniqueAnioLectivos().subscribe({
      next: rest => {
        this.aniolectivos = rest.message;
      },
      error: err => console.error(err)
    });
  }

  cargarCursos(): void {
    this.adminService.getCursosPorAnioLectivo(this.selectedAlectivo.id).subscribe({
      next: rest => {
        if (rest['code'] == 200) {
          this.cursos = rest.message;
        } else if (rest['code'] == 404) {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Éxito!', detail: 'No existen cursos registrados', life: 10000 });
        }
      },
      error: err => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información', life: 10000 });
        console.error(err)
      }
    })
  }

  filterALectivo(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.aniolectivos as any[]).length; i++) {
      let alectivo = (this.aniolectivos as any[])[i];
      if (alectivo.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(alectivo);
      }
    }
    this.filteredAnioLectivos = filtered;
  }

  filterCurso(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.cursos as any[]).length; i++) {
      let curso = (this.cursos as any[])[i];
      if (curso.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(curso);
      }
    }
    this.filteredCursos = filtered;
  }

  cargarMatritulas() {
    let datos = {
      anio_lectivo_id: this.selectedAlectivo?.id,
      curso_id: this.selectedCurso?.id
    }
    this.listaMatriculas(datos);
  }

  listaMatriculas(datos) {
    this.spinner.show();
    this.adminService.getMatriculasByAnioAndCursoParaMaterias(datos).subscribe({
      next: rest => {
        if (rest.code != '404') {
          this.matriculas = rest['message'];
        } else {
          this.matriculas = [];
          this.messageService.add({
            severity: 'info',
            summary: 'Información',
            detail: 'No existen matriculas registradas'
          });
        }
        this.anioCursoText = `"${this.selectedAlectivo?.nombre}" - "${this.selectedCurso?.nombre}"`
        this.spinner.hide();
      },
      error: err => console.error(err)
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  modificarNotas(data: any) {
    this.agregarNotas = true;
    this.idMatricula = data.id
    this.cargarMaterias(data.anio_lectivo_id, data.curso_id);
  }

  cargarMaterias(anio_lectivo_id, curso_id) {
    this.spinner.show();
    this.adminService.getMateriasPorCursoYAnioLectivo(anio_lectivo_id, curso_id).subscribe({
      next: rest => {
        if (rest['code'] == 200) {
          this.materias = rest.message;
          this.cargarNotas();
        } else if (rest['code'] == 404) {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información', detail: 'No existen materias registradas' });
        }
        this.spinner.hide();
      },
      error: err => console.error(err)
    })
  }

  cargarNotas() {
    this.adminService.obtenerNotas(this.idMatricula).subscribe(
      (notas) => {
        this.agregarMaterias(notas); // Pasar las notas al método agregarMaterias
      },
      (error) => {
        console.error('Error al cargar notas:', error);
      }
    );
  }

  cerrarDialog() {
    this.materiasFormArray.reset();
    this.notasForm.reset();
    this.agregarNotas = false;
  }
}
