import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { AdminService } from 'src/app/SantaGema/service/admin.service';
import { ALectivo, Curso, Estudiante, Representante } from 'src/app/SantaGema/service/interface';

@Component({
  selector: 'app-crear-matricula',
  templateUrl: './crear-matricula.component.html',
  styleUrls: ['./crear-matricula.component.scss'],
  providers: [MessageService]
})
export class CrearMatriculaComponent implements OnInit {

  countries: any[] | undefined;

  selectedAlectivo: any;
  filteredAnioLectivos: any[] | undefined;
  aniolectivos: ALectivo[] | undefined;

  selectedCurso: any;
  filteredCursos: any[] | undefined;
  cursos: Curso[] | undefined;
  cedulaRepre: string = '';
  cedulaEstu: string = '';
  loadingRepre: boolean = false;
  loadingEstu: boolean = false;
  btnConsultarRepre: boolean = true;
  btnConsultarEstu: boolean = true;
  formularioRepre: boolean = false;
  formularioEstu: boolean = false;
  representante: Representante;
  estudiante: Estudiante;
  selectedParentesco: any;
  numMatricula = '';
  dropdownItemsParentesco = [
    { name: 'Seleccionar', code: null, disabled: true },
    { name: 'Materno', code: 'Materno' },
    { name: 'Paterno', code: 'Paterno' },
    { name: 'Otros', code: 'Otros' }
  ];

  submittedRepre = false;
  validatedFormRepre = false;
  submittedEstu = false;
  validatedFormEstu = false;
  validatedFormMatricula = false;

  constructor(private adminService: AdminService, private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {

  }
  ngOnInit(): void {
    this.limpiarInterface();
    this.cargarALectivos();
  }

  cargarALectivos(): void {
    this.spinner.show();
    this.adminService.getUniqueAnioLectivos().subscribe({
      next: rest => {
        this.aniolectivos = rest.message;
        this.spinner.hide();
      },
      error: err => {
        this.spinner.hide();  
      }
    });
  }
  cargarCursos(): void {
    this.spinner.show();
    this.adminService.getCursosPorAnioLectivo(this.idAlectivo).subscribe({
      next: rest => {
        if (rest['code'] == 200) {
          this.cursos = rest.message;
          this.cursoDisabled = false;
        } else if (rest['code'] == 404) {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Éxito!', detail: 'No existen cursos registrados', life: 10000 });
        }
        this.spinner.hide();
      },
      error: err => {
        this.spinner.hide();
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información', life: 10000 });
        console.error(err)
      }
    })
  }

  limpiarInterface() {
    let usuarios = {
      id: 0,
      nombres: '',
      cedula: '',
      apellidos: '',
      nacionalidad: '',
      genero: ''

    }
    this.limpiarEstudiante(usuarios);
    this.limpiarRepresentante(usuarios);
    this.numMatricula = '';
    this.cedulaEstu = '';
    this.cedulaRepre = '';
    this.selectedAlectivo = '';
    this.selectedCurso = '';
    this.formularioEstu = false;
    this.formularioRepre = false;
  }

  limpiarRepresentante(usuarios) {
    this.representante = {
      id: 0,
      usuarios: usuarios, // O puedes inicializar con un objeto Usuarios vacío si tienes la interfaz definida
      direccion: '',
      telefono: '',
      correo: ''
    }
  }

  limpiarEstudiante(usuarios) {
    this.estudiante = {
      id: 0,
      usuarios: usuarios, // O puedes inicializar con un objeto Usuarios vacío si tienes la interfaz definida
      direccion: '',
      telefono: '',
      correo: ''
    }
  }

  ingresoCedula(event: any, text) {
    const valor = event.target.value;
    if (text == 'repre') {
      if (valor.length == 10) {
        this.btnConsultarRepre = false;
      } else {
        this.formularioRepre = false;
        this.btnConsultarRepre = true;
        let usuarios = {
          id: 0,
          nombres: '',
          cedula: '',
          apellidos: '',
          nacionalidad: '',
          genero: ''

        }
        this.limpiarRepresentante(usuarios);
      }
    } else {
      if (valor.length == 10) {
        this.btnConsultarEstu = false;
      } else {
        this.formularioEstu = false;
        this.btnConsultarEstu = true;
        let usuarios = {
          id: 0,
          nombres: '',
          cedula: '',
          apellidos: '',
          nacionalidad: '',
          genero: ''
        }
        this.limpiarEstudiante(usuarios);
      }
    }
  }

  consultar(text) {
    if (text === 'repre') {
      this.spinner.show();
      this.adminService.getUsuarioMatricula(this.cedulaRepre).subscribe({
        next: restUsuario => {
          if (restUsuario.code === '404') {
            this.messageService.add({ severity: 'info', summary: 'Información!', detail: 'La cedula no se encuentra registrada' });
            this.formularioRepre = false;
          } else if (restUsuario.code === '200') {
            this.spinner.show();
            this.adminService.getRepresentante(restUsuario['message'].id).subscribe({
              next: rest => {
                if (rest.code === '200') {
                  this.representante = rest.message;
                  this.representante.usuarios = restUsuario['message'];
                  this.selectedParentesco = { code: rest['message'].parentesco, name: rest['message'].parentesco }
                }
                this.spinner.hide();
              }, error: e => {
                console.log(e);
              }
            })
            this.formularioRepre = true;
            this.representante['usuarios'] = restUsuario.message;
          }
          this.spinner.hide();
        }, error: e => {
          console.log(e);
          this.spinner.hide();
          this.formularioRepre = false;
          this.btnConsultarRepre = true;
        }
      })
    } else {
      this.spinner.show();
      this.adminService.getUsuarioMatricula(this.cedulaEstu).subscribe({
        next: restUsuario => {
          if (restUsuario.code === '404') {
            this.messageService.add({ severity: 'info', summary: 'Información!', detail: 'La cedula no se encuentra registrada' });
            this.formularioEstu = false;
          } else if (restUsuario.code === '200') {
            this.spinner.show();
            this.adminService.getEstudiante(restUsuario['message'].id).subscribe({
              next: rest => {
                if (rest.code === '200') {
                  this.estudiante = rest.message;
                  this.estudiante.usuarios = restUsuario['message'];
                }
                this.spinner.hide();
              }, error: e => {
                this.spinner.hide();
                console.log(e);
              }
            })
            this.formularioEstu = true;
            this.estudiante['usuarios'] = restUsuario.message;
          }
          this.spinner.hide();
        }, error: e => {
          this.spinner.hide();
          console.log(e);
          this.formularioEstu = false;
          this.btnConsultarEstu = true;
        }
      })
    }
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

  actualizarRepresentante() {
    this.submittedRepre = true;
    this.validatedFormRepre = true
    this.representante['parentesco'] = this.selectedParentesco.name;
    if (this.representante['parentesco'] != ('Seleccionar') && this.representante['direccion'] != ('') &&
      this.representante['telefono'] != ('') && this.representante['correo'] != ('')) {
      if (this.representante['id'] != (0)) {
        this.spinner.show();
        this.adminService.updateRepresentante(this.representante).subscribe({
          next: rest => {
            if (rest.code === '200') {
              this.messageService.add({ severity: 'success', summary: 'Información!', detail: 'Representante actualizado correctamente' });
            }
            this.spinner.hide();
          }, error: e => {
            console.log(e);
            this.spinner.hide();
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error al actualizar el representante' });
          }
        })
      } else {
        this.spinner.show();
        this.adminService.createRepresentante(this.representante).subscribe({
          next: rest => {
            if (rest.code === '200') {
              this.representante['id'] = rest.id;
              this.messageService.add({ severity: 'success', summary: 'Información!', detail: 'Representante creado correctamente' });
            }
            this.spinner.hide();
          }, error: e => {
            console.log(e);
            this.spinner.hide();
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error al crear el representante' });
          }
        })
      }
    }

  }

  actualizarEstudiante() {
    this.submittedEstu = true;
    this.validatedFormEstu = true
    if (this.estudiante['direccion'] != ('') && this.estudiante['telefono'] != ('') && this.estudiante['correo'] != ('')) {
      if (this.estudiante['id'] != (0)) {
        this.spinner.show();
        this.adminService.updateEstudiante(this.estudiante).subscribe({
          next: rest => {
            if (rest.code === '200') {
              this.messageService.add({ severity: 'success', summary: 'Información!', detail: 'Estudiante actualizado correctamente' });
            }
            this.spinner.hide();
          }, error: e => {
            console.log(e);
            this.spinner.hide();
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error al actualizar el estudiante' });
          }
        })
      } else {
        this.spinner.show();
        this.adminService.createEstudiante(this.estudiante).subscribe({
          next: rest => {
            if (rest.code === '200') {
              this.estudiante['id'] = rest.id;
              this.messageService.add({ severity: 'success', summary: 'Información!', detail: 'Representante creado correctamente' });
            }
            this.spinner.hide();
          }, error: e => {
            console.log(e);
            this.spinner.hide();
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error al crear el representante' });
          }
        })
      }
    }
  }

  crearMatricula() {
    this.validatedFormEstu = true;
    this.validatedFormMatricula = true;
    this.validatedFormRepre = true;
    if (this.cedulaEstu == this.cedulaRepre) {
      this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'La cedula del representante y estudiante no pueden ser iguales' });
      return;
    }
    if (this.numMatricula != '' && this.formularioEstu && this.formularioRepre && this.selectedAlectivo.id && this.selectedCurso.id && this.representante.id && this.estudiante.id) {
      let dato = {
        matriculaNum: this.numMatricula,
        estudiante_id: this.estudiante.id,
        representante_id: this.representante.id,
        anio_lectivo_id: this.selectedAlectivo.id,
        curso_id: this.selectedCurso.id
      }
      this.spinner.show();
      this.adminService.createMatricula(dato).subscribe({
        next: rest => {
          if (rest.code === '200') {
            this.messageService.add({ severity: 'success', summary: 'Correcto!', detail: 'Matricula creada correctamente' });
          this.limpiarInterface();
          }
          if (rest.code === '401') {
            this.messageService.add({ severity: 'info', summary: 'Información!', detail: rest.message });
          }
          this.spinner.hide();
        }, error: e => {
          this.spinner.hide();
          console.log(e);
          this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error al crear la matricula' });
        }
      })
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Todos los campos son obligatorios' });
    }
  }

  idAlectivo: any;
  cursoDisabled:boolean = true;
  onSelectALectivo(event: any) {
    this.idAlectivo = event.id;
    this.selectedCurso = [];
    this.cargarCursos();
  }

}
