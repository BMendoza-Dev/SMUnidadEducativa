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
  submitted: boolean = false;


  aniolectivos: any[] | undefined;
  cursos: any[] | undefined;
  materias: any[] | undefined;
  constructor(private messageService: MessageService, private adminService: AdminService, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.aLectivoForm = this.fb.group({
      aLectivo: [null, Validators.required],
      curso: [null, Validators.required],
      materias: [null, Validators.required]
    });

    this.getListALectivo();
    this.getListCurso();
    this.getListMateria();
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
          debugger
        }, error: e => {
          console.log(e);
        }
      });
      // Lógica adicional para guardar los datos
    } else {
      console.log('El formulario no es válido');
    }
  }
}
