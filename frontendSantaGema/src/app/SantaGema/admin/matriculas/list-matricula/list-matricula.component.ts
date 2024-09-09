import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { AdminService } from 'src/app/SantaGema/service/admin.service';
import { ALectivo, Curso, Estudiante, Representante } from 'src/app/SantaGema/service/interface';

@Component({
  selector: 'app-list-matricula',
  templateUrl: './list-matricula.component.html',
  styleUrls: ['./list-matricula.component.scss'],
  providers: [MessageService]
})
export class ListMatriculaComponent {

  aniolectivos: ALectivo[] | undefined;
  cursos: Curso[] | undefined;
  filteredCursos: any[] | undefined;
  filteredAnioLectivos: any[] | undefined;
  filteredCursosEdit: any[] | undefined;
  filteredAnioLectivosEdit: any[] | undefined;
  selectedCurso: any;
  selectedAlectivo: any;
  selectedCursoEdit: any;
  selectedAlectivoEdit: any;

  matriculas: any[] = [];
  cols: any[] = [];
  selectedMatriculas: any[] = [];

  deleteMatriculaDialog: boolean = false;
  deleteMatriculasDialog: boolean = false;
  matriculaDialog: boolean = false;
  matricula: any = {};

  dropdownItemsParentesco = [
    { name: 'Seleccionar', code: null, disabled: true },
    { name: 'Materno', code: 'Materno' },
    { name: 'Paterno', code: 'Paterno' },
    { name: 'Otros', code: 'Otros' }
  ];
  constructor(private adminService: AdminService, private messageService: MessageService) { }

  ngOnInit(): void {
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
    this.cargarALectivos();
    this.cargarCursos();
    let datos = {
      anio_lectivo_id: 0,
      curso_id: 0
    }
    this.listaMatriculas(datos);
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'matriculaNum', header: 'Número de Matrícula' },
      { field: 'estudiante.usuario.cedula', header: 'Cédula de Estudiante' },
      { field: 'nom_apellEstudiante', header: 'Estudiante' },
      { field: 'cedulaRepresentante', header: 'Cédula de Representante' },
      { field: 'nom_apellRepresentante', header: 'Representante' },
    ];
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
    let todo = {
      id: 0,
      nombre: "Todos los Años Lectivos"
    }
    this.filteredAnioLectivos.unshift(todo);
  }

  filterALectivoEdit(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.aniolectivos as any[]).length; i++) {
      let alectivo = (this.aniolectivos as any[])[i];
      if (alectivo.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(alectivo);
      }
    }
    this.filteredAnioLectivosEdit = filtered;
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
    let todo = {
      id: 0,
      nombre: "Todos los Cursos"
    }
    this.filteredCursos.unshift(todo)
  }

  filterCursoEdit(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.cursos as any[]).length; i++) {
      let curso = (this.cursos as any[])[i];
      if (curso.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(curso);
      }
    }
    this.filteredCursosEdit = filtered;
  }

  cargarALectivos(): void {
    this.adminService.getListALectivo().subscribe({
      next: rest => {
        this.aniolectivos = rest.message;
      },
      error: err => console.error(err)
    });
  }
  cargarCursos(): void {
    this.adminService.getListCurso().subscribe({
      next: rest => {
        this.cursos = rest.message;
      },
      error: err => console.error(err)
    })
  }

  cargarMatritulas() {
    let datos = {
      anio_lectivo_id: this.selectedAlectivo.id,
      curso_id: this.selectedCurso.id
    }
    this.listaMatriculas(datos);
  }

  listaMatriculas(datos) {
    this.adminService.getMatriculasByAnioAndCurso(datos).subscribe({
      next: rest => {
        if (rest.code != '404') {
          this.matriculas = rest['message'].map((matricula: any) => {
            return{
              ...matricula,
              nom_apellEstudiante: matricula.estudiante.usuario.apellidos + ' ' + matricula.estudiante.usuario.nombres,
              nom_apellRepresentante: matricula.representante.usuario.apellidos +' '+ matricula.representante.usuario.nombres
            }
          });
        } else {
          this.matriculas = [];
          this.messageService.add({
            severity: 'info',
            summary: 'Información',
            detail: 'No existen matriculas registradas'
          });
        }
      },
      error: err => console.error(err)
    })
  }

  deleteMatricula(matricula: any) {
    this.deleteMatriculaDialog = true;
    this.matricula = { ...matricula };
  }

  confirmDelete() {
    this.deleteMatriculaDialog = false;
    this.matriculas = this.matriculas.filter(val => val.id !== this.matricula.id);

    let ids = [
      this.matricula.id
    ]
    this.adminService.deleteMatricula(ids).subscribe({
      next: rest => {

        if (rest['code'] == "200") {
          this.matricula = {};
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Matricula eliminado', life: 3000 });
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información' });
        }

      }, error: e => {
        window.location.reload();
        console.log(e);
      }
    })
  }

  deleteSelectedMatriculas() {
    this.deleteMatriculasDialog = true;
  }

  confirmDeleteSelected() {
    this.deleteMatriculasDialog = false;
    this.selectedMatriculas;
    let listaIds = this.selectedMatriculas.map(usuario => usuario.id);
    this.adminService.deleteMatricula(listaIds).subscribe({
      next: rest => {
        if (rest['code'] == "200") {
          this.matriculas = this.matriculas.filter(val => !this.selectedMatriculas.includes(val));
          this.selectedMatriculas = [];
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Años Lectivos eliminados', life: 3000 });
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información' });
        }

      }, error: e => {
        console.log(e)
      }
    })
  }


  matriculaNum = '';
  cedulaRepre = '';
  cedulaEstu = '';
  editMatricula(matricula: any) {
    this.matricula = { ...matricula };
    this.matriculaDialog = true;
    this.selectedAlectivoEdit = matricula.aniolectivo;
    this.selectedCursoEdit = matricula.curso;
    this.matriculaNum = matricula.matriculaNum;
    this.cedulaRepre = matricula.representante.usuario.cedula;
    this.cedulaEstu = matricula.estudiante.usuario.cedula;
    this.consultar('repre');
    this.consultar('estu');
  }

  hideDialog() {
    this.matriculaDialog = false;
  }

  btnConsultarRepre = false;
  formularioRepre = false;
  btnConsultarEstu = false;
  formularioEstu = false;
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

  representante: Representante;
  estudiante: Estudiante;
  limpiarRepresentante(usuarios){
    this.representante = {
      id: 0,
      usuarios: usuarios, // O puedes inicializar con un objeto Usuarios vacío si tienes la interfaz definida
      direccion: '',
      telefono: '',
      correo: ''
    }
  }

  limpiarEstudiante(usuarios){
    this.estudiante = {
      id: 0,
      usuarios: usuarios, // O puedes inicializar con un objeto Usuarios vacío si tienes la interfaz definida
      direccion: '',
      telefono: '',
      correo: ''
    }
  }

  selectedParentesco: any;
  consultar(text) {
    if (text === 'repre') {
      this.adminService.getUsuarioMatricula(this.cedulaRepre).subscribe({
        next: restUsuario => {
          if (restUsuario.code === '404') {
            this.messageService.add({ severity: 'info', summary: 'Información!', detail: 'La cedula no se encuentra registrada' });
            this.formularioRepre = false;
          } else if (restUsuario.code === '200') {
            this.adminService.getRepresentante(restUsuario['message'].id).subscribe({
              next: rest => {
                if (rest.code === '200') {
                  this.representante = rest.message;
                  this.representante.usuarios = restUsuario['message'];
                  this.selectedParentesco = { code: rest['message'].parentesco, name: rest['message'].parentesco }
                }
              }, error: e => {
                console.log(e);
              }
            })
            this.formularioRepre = true;
            this.representante['usuarios'] = restUsuario.message;
          }
        }, error: e => {
          console.log(e);
          this.formularioRepre = false;
          this.btnConsultarRepre = true;
        }
      })
    } else {
      this.adminService.getUsuarioMatricula(this.cedulaEstu).subscribe({
        next: restUsuario => {
          if (restUsuario.code === '404') {
            this.messageService.add({ severity: 'info', summary: 'Información!', detail: 'La cedula no se encuentra registrada' });
            this.formularioEstu = false;
          } else if (restUsuario.code === '200') {
            this.adminService.getEstudiante(restUsuario['message'].id).subscribe({
              next: rest => {
                if (rest.code === '200') {
                  this.estudiante = rest.message;
                  this.estudiante.usuarios = restUsuario['message'];
                }
              }, error: e => {
                console.log(e);
              }
            })
            this.formularioEstu = true;
            this.estudiante['usuarios'] = restUsuario.message;
          }
        }, error: e => {
          console.log(e);
          this.formularioEstu = false;
          this.btnConsultarEstu = true;
        }
      })
    }
  }
  
  submittedRepre = false;
  validatedFormRepre = false;
  submittedEstu = false;
  validatedFormEstu = false;
  validatedFormMatricula = false;
  actualizarRepresentante() {
    this.submittedRepre = true;
    this.validatedFormRepre = true
    this.representante['parentesco'] = this.selectedParentesco.name;
    if (this.representante['parentesco'] != ('Seleccionar') && this.representante['direccion'] != ('') &&
      this.representante['telefono'] != ('') && this.representante['correo'] != ('')) {
      if (this.representante['id'] != (0)) {
        this.adminService.updateRepresentante(this.representante).subscribe({
          next: rest => {
            if (rest.code === '200') {
              this.messageService.add({ severity: 'success', summary: 'Información!', detail: 'Representante actualizado correctamente' });
            }
          }, error: e => {
            console.log(e);
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error al actualizar el representante' });
          }
        })
      } else {
        this.adminService.createRepresentante(this.representante).subscribe({
          next: rest => {
            if (rest.code === '200') {
              this.representante['id'] = rest.id;
              this.messageService.add({ severity: 'success', summary: 'Información!', detail: 'Representante creado correctamente' });
            }
          }, error: e => {
            console.log(e);
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
        this.adminService.updateEstudiante(this.estudiante).subscribe({
          next: rest => {
            if (rest.code === '200') {
              this.messageService.add({ severity: 'success', summary: 'Información!', detail: 'Estudiante actualizado correctamente' });
            }
          }, error: e => {
            console.log(e);
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error al actualizar el estudiante' });
          }
        })
      } else {
        this.adminService.createEstudiante(this.estudiante).subscribe({
          next: rest => {
            if (rest.code === '200') {
              this.estudiante['id'] = rest.id;
              this.messageService.add({ severity: 'success', summary: 'Información!', detail: 'Representante creado correctamente' });
            }
          }, error: e => {
            console.log(e);
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error al crear el representante' });
          }
        })
      }
    }
  }

  actualizarMatricula(){
    this.validatedFormEstu = true;
    this.validatedFormMatricula = true;
    this.validatedFormRepre = true;
    if(this.cedulaEstu == this.cedulaRepre){
      this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'La cedula del representante y estudiante no pueden ser iguales' });
      return;
    }
    if(this.matriculaNum != '' && this.formularioEstu && this.formularioRepre && this.selectedAlectivoEdit.id && this.selectedCursoEdit.id && this.representante.id && this.estudiante.id){
      let dato = {
        matriculaNum: this.matriculaNum,
        estudiante_id: this.estudiante.id,
        representante_id: this.representante.id,
        anio_lectivo_id: this.selectedAlectivoEdit.id,
        curso_id: this.selectedCursoEdit.id
      }
      let idMatricula =  this.matricula.id;
      this.adminService.updateMatricula(dato,idMatricula).subscribe({
        next: rest => {
          if(rest.code === '200'){
            this.messageService.add({ severity:'success', summary: 'Información!', detail: 'Matricula actualizada correctamente' });
            this.limpiarInterface();
          }
        }, error: e => {
          console.log(e);
          this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error al actualizar la matricula' });
        }
      })
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Todos los campos son obligatorios' });
    }
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
    this.matriculaNum = '';
    this.cedulaEstu='';
    this.cedulaRepre='';
    this.selectedAlectivoEdit = '';
    this.selectedCursoEdit = '';
    this.formularioEstu = false;
    this.formularioRepre = false;
    this.matriculaDialog = false;
  }
}
