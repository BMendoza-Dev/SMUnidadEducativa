import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { AdminService } from '../../service/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gestion-alectivos',
  templateUrl: './gestion-alectivos.component.html',
  styleUrls: ['./gestion-alectivos.component.scss'],
  providers: [MessageService]
})
export class GestionAlectivosComponent implements OnInit {
  selectedAlectivo: any;
  selectedCurso: any;
  filteredAnioLectivos: any[] | undefined;
  filteredCursos: any[] | undefined;
  aLectivoForm: FormGroup;
  aLectivoUpdForm: FormGroup;
  submitted: boolean = false;
  submittedUpd: boolean = false;
  activeIndex: number = 0;

  aniolectivos: any[] | undefined;
  cursos: any[] | undefined;
  materias: any[] | undefined;

  filteredAnioLectivosUpd: any[] | undefined;
  filteredCursosUpd: any[] | undefined;

  aniolectivosUpd: any[] | undefined;
  cursosUpd: any[] | undefined;
  materiasUpd: any[] | undefined;
  constructor(private messageService: MessageService, private adminService: AdminService, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.aLectivoForm = this.fb.group({
      aLectivo: [null, Validators.required],
      curso: [null, Validators.required],
      materias: [null, Validators.required]
    });

    this.aLectivoUpdForm = this.fb.group({
      aLectivoUpd: [null, Validators.required],
      cursoUpd: [null, Validators.required],
      materiasUpd: [null, Validators.required]
    });
    this.getListALectivo();
    this.getListCurso();
    this.getListMateria();
  }

  register() {
    this.getListALectivo();
    this.getListCurso();
    this.getListMateria();
  }

  getListALectivoUpd() {
    this.adminService.getUniqueAnioLectivos().subscribe({
      next: rest => {
        if (rest['code'] == 200) {
          this.aniolectivosUpd = rest.message;
        } else if (rest['code'] == 404) {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Éxito!', detail: 'No existen años lectivos registrados', life: 10000 });
        }
      },
      error: err => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información', life: 10000 });
        console.error(err)
      }

    })
  }

  update() {
    this.getListALectivoUpd();
  }

  getListCursoUpd() {
    this.adminService.getCursosPorAnioLectivo(this.idAlectivo).subscribe({
      next: rest => {
        if (rest['code'] == 200) {
          this.cursosUpd = rest.message;
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

  getListMateriaUpd(){
    this.adminService.getMateriasPorCursoYAnioLectivo(this.idAlectivo,this.idCurso).subscribe({
      next: rest => {
        if (rest['code'] == 200) {
          this.materiasUpd = rest.message;
          this.aLectivoUpdForm.patchValue({
            materiasUpd: this.materiasUpd
          }); 
        } else if (rest['code'] == 404) {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Éxito!', detail: 'No existen materias registradas', life: 10000 });
        }
      },
      error: err => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información', life: 10000 });
        console.error(err)
      }
    })
  }

  idAlectivo:any
  onSelectALectivo(event: any) {
    this.idAlectivo = event.id;
    this.aLectivoUpdForm.get('cursoUpd')?.reset();
    this.getListCursoUpd();
  }

  idCurso:any
  onSelectCurso(event: any) {
    this.idCurso = event.id;
    this.aLectivoUpdForm.get('materiasUpd')?.reset();
    this.getListMateriaUpd()
  }

  onTabChange(event: any) {
    const index = event.index; // Obtiene el índice de la pestaña seleccionada
    if (index === 1) {
      this.update(); // Ejecuta la función update si es la segunda pestaña
    } else if (index === 0) {
      this.register();
    }
  }
  getListALectivo(): void {
    this.adminService.getListALectivo().subscribe({
      next: data => {
        this.aniolectivos = data['message'];  // Asignas los años lectivos a la lista
      },
      error: e => {
        console.log(e);
      }
    });
  }

  // Lógica para obtener la lista de cursos
  getListCurso(): void {
    this.adminService.getListCurso().subscribe({
      next: data => {
        this.cursos = data['message'];  // Asignas los cursos a la lista
      },
      error: e => {
        console.log(e);
      }
    });
  }

  // Lógica para obtener la lista de materias
  getListMateria(): void {
    this.adminService.getListMateria().subscribe({
      next: data => {
        this.materias = data['message'];  // Asignas las materias a la lista
      },
      error: e => {
        console.log(e);
      }
    });
  }

  filterALectivo(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    // Verificamos que `this.cursos` es un array
    if (this.aniolectivos && Array.isArray(this.aniolectivos)) {
      for (let i = 0; i < this.aniolectivos.length; i++) {
        let aniolectivos = this.aniolectivos[i];
        // Filtra los cursos que comiencen con el texto ingresado (case insensitive)
        if (aniolectivos.nombre.toLowerCase().indexOf(query.toLowerCase()) === 0) {
          filtered.push(aniolectivos);
        }
      }
    }

    this.filteredAnioLectivos = filtered;
  }

  filterCurso(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    // Verificamos que `this.cursos` es un array
    if (this.cursos && Array.isArray(this.cursos)) {
      for (let i = 0; i < this.cursos.length; i++) {
        let curso = this.cursos[i];
        // Filtra los cursos que comiencen con el texto ingresado (case insensitive)
        if (curso.nombre.toLowerCase().indexOf(query.toLowerCase()) === 0) {
          filtered.push(curso);
        }
      }

    }

    this.filteredCursos = filtered;
  }

  filterALectivoUpd(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    // Verificamos que `this.cursos` es un array
    if (this.aniolectivosUpd && Array.isArray(this.aniolectivosUpd)) {
      for (let i = 0; i < this.aniolectivosUpd.length; i++) {
        let aniolectivosUpd = this.aniolectivosUpd[i];
        // Filtra los cursos que comiencen con el texto ingresado (case insensitive)
        if (aniolectivosUpd.nombre.toLowerCase().indexOf(query.toLowerCase()) === 0) {
          filtered.push(aniolectivosUpd);
        }
      }
    }

    this.filteredAnioLectivosUpd = filtered;
  }

  filterCursoUpd(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    // Verificamos que `this.cursos` es un array
    if (this.cursosUpd && Array.isArray(this.cursosUpd)) {
      for (let i = 0; i < this.cursosUpd.length; i++) {
        let cursosUpd = this.cursosUpd[i];
        // Filtra los cursos que comiencen con el texto ingresado (case insensitive)
        if (cursosUpd.nombre.toLowerCase().indexOf(query.toLowerCase()) === 0) {
          filtered.push(cursosUpd);
        }
      }
    }

    this.filteredCursosUpd = filtered;
  }


  isFieldInvalid(field: string): boolean {
    return (!this.aLectivoForm.get(field)?.valid && this.aLectivoForm.get(field)?.touched) ||
      (this.aLectivoForm.get(field)?.untouched && this.submitted);
  }

  saveALectivos() {
    this.submitted = true; // Marca el formulario como enviado
    if (this.aLectivoForm.valid) {
      const formValues = this.aLectivoForm.value;
      this.adminService.attachMateriasToCursoInAnioLectivo(formValues.aLectivo, formValues.curso, formValues.materias).subscribe({
        next: rest => {
          if (rest['code'] == 200) {
            this.aLectivoForm.reset();
            this.submitted = false;  // Resetea el formulario
            this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Se proceso correctamente', life: 10000 });
          } else if (rest['code'] == 409) {
            this.messageService.add({ key: 'tst', severity: 'info', summary: 'Éxito!', detail: 'Este año lectivo ya cuenta con este curso registrado', life: 10000 });
          } else {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información', life: 10000 });
          }
        }, error: e => {
          console.log(e);
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información', life: 10000 });
        }
      });
      // Lógica adicional para guardar los datos
    } else {
      console.log('El formulario no es válido');
    }
  }

  updateALectivos() {
    this.submittedUpd = true; // Marca el formulario como enviado
    if (this.aLectivoUpdForm.valid) {
      const formValues = this.aLectivoUpdForm.value;
      this.adminService.updateMateriasForCursoInAnioLectivo(formValues.aLectivoUpd, formValues.cursoUpd, formValues.materiasUpd).subscribe({
        next: rest => {
          if (rest['code'] == 200) {
            this.aLectivoUpdForm.reset();
            this.submitted = false;  // Resetea el formulario
            this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Se proceso correctamente', life: 10000 });
          } else if (rest['code'] == 409) {
            this.messageService.add({ key: 'tst', severity: 'info', summary: 'Éxito!', detail: 'Este año lectivo ya cuenta con este curso registrado', life: 10000 });
          } else {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información', life: 10000 });
          }
        }, error: e => {
          console.log(e);
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información', life: 10000 });
        }
      });
      // Lógica adicional para guardar los datos
    } else {
      console.log('El formulario no es válido');
    }
  }


}
