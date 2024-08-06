import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { MessageService } from 'primeng/api';
import { Usuarios } from '../../service/interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [MessageService]
})
export class UsuariosComponent implements OnInit {

  btnConsultar: boolean = true;
  btnGuardar: boolean = true;
  loading: boolean = false;
  formularioAct: boolean = false;
  nombres: string = '';
  apellidos: string = '';
  fecha_nacimiento: any = "";
  cedula: string = '';
  formulario: FormGroup;
  usuarioForm: Usuarios;
  submitted = false;
  validatedForm = false;
  selectedNacionalidad: any;
  selectedGenero: any;
  deleteUsuariosDialog: boolean = false;
  selectedUsuarios: Usuarios[] = [];
  usuarios: Usuarios[] = [];
  cols: any[] = [];
  usuario: Usuarios = {};
  usuarioDialog:boolean = false;

  dropdownItemsNac = [
    { name: 'Seleccionar', code: null, disabled: true },
    { name: 'Ecuatoriana', code: '1' },
    { name: 'Extranjera', code: '2' }
  ];

  dropdownItemsGen = [
    { name: 'Seleccionar', code: null, disabled: true },
    { name: 'Masculino', code: '1' },
    { name: 'Femenino', code: '2' }
  ];

  constructor(private adminService: AdminService, private messageService: MessageService, private fb: FormBuilder) {
    this.getList();
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'cedula', header: 'Cédula' },
      { field: 'nombres', header: 'Nombres' },
      { field: 'apellidos', header: 'Apellidos' },
      { field: 'nacionalidad', header: 'Nacionalidad' },
      { field: 'genero', header: 'Género' },
      { field: 'fecha_nacimiento', header: 'Fecha de Nacimiento' }
    ];
   }
  ngOnInit(): void {

  }

  getList(): void {
    this.adminService.getListUsuario().subscribe({
      next: (data: any) => {
        if (Array.isArray(data['message']) && data['message'].length > 0) {
          this.usuarios = data['message'];
        } else {
          this.usuarios = [];
          this.messageService.add({
            severity: 'info',
            summary: 'Información',
            detail: 'No existen usuarios registrados'
          });
        }
      },
      error: (error) => {
        console.error('Error al obtener la lista de usuarios:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo obtener la lista de usuarios'
        });
        this.usuarios = [];
      }
    });
  }

  consultar(): void {
    this.loading = true;
    this.adminService.consultarCedula(this.cedula).subscribe({
      next: (res: any) => {
        if (res.code == 404) {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información!', detail: 'La cedula no se encuentra registrada' });
          this.formularioAct = true;
        } else if (res.code == 200) {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información!', detail: 'La cédula se ecuentra registrada' });
          this.formularioAct = false;
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información' });
        this.loading = false;
      }
    }
    );
  }

  ingresoCedula(event: any) {
    const valor = event.target.value;
    if (valor.length == 10) {
      this.btnConsultar = false;
    } else {
      this.formularioAct = false;
      this.btnConsultar = true;
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.usuarios.length; i++) {
        if (this.usuarios[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

  saveUsuario() {
    this.submitted = true;
    this.validatedForm = true
    if (this.usuario.id) {
      if (this.usuario.nombres != "" && this.usuario.apellidos != "" && this.usuario.cedula != "" && this.usuario.fecha_nacimiento != "" && this.usuario.nacionalidad != "" && this.usuario.genero != "") {
        this.usuario.genero = this.usuario.genero.name;
        this.usuario.nacionalidad = this.usuario.nacionalidad.name;
        this.usuario.nombres = this.usuario.nombres.toUpperCase();
        this.usuario.apellidos = this.usuario.apellidos.toUpperCase();
        this.usuario.fecha_nacimiento = this.formatDate(this.usuario.fecha_nacimiento);
        
        this.usuarios[this.findIndexById(this.usuario.id)] = this.usuario;
            this.adminService.updateUsuario(this.usuario).subscribe({
                next:rest => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Año Lectivo actualizado', life: 3000 });    
                    this.getList();
                    
                    this.usuarioDialog = false;
                    this.usuario = {};    
                },error:e=>{
                    this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información' });
                    setTimeout(() => {
                        window.location.reload();
                        console.log(e);
                    }, 2000);
                }
            })
        }else{
            this.submitted=true;
            this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Alerta!', detail: 'Existe campos vacios' });
        }
    } else {    
      this.usuario = {
        nombres: this.nombres.toUpperCase(),
        apellidos:this.apellidos.toUpperCase(),
        cedula: this.cedula,
        fecha_nacimiento: this.fecha_nacimiento=='' ? "":this.formatDate(this.fecha_nacimiento),
        nacionalidad: this.selectedNacionalidad.name,
        genero: this.selectedGenero.name,
      }
    if (this.usuario.nombres != "" && this.usuario.apellidos != "" && this.usuario.cedula != "" && this.usuario.fecha_nacimiento != "" && this.usuario.nacionalidad != "" && this.usuario.genero != "") {
      this.adminService.registrarUsuario(this.usuario).subscribe({
        next: rest => {
          if (rest.code == "200") {
            console.log("Se guardo correctamente");
            this.usuario.id = rest.id;
            
            this.usuarios.push(this.usuario);
            this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Se proceso correctamente' });
            this.usuarios = [...this.usuarios];
            // this.usuarioDialog = false;
            this.usuario = {};
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

  clearVariable(){
    this.usuario = {};
    this.apellidos = "";
    this.cedula = "";
    this.nombres = "";
    this.fecha_nacimiento = "";
    this.selectedGenero = null;
    this.selectedNacionalidad = null;
    this.formularioAct = false;
  }

  hideDialog() {
    this.usuarioDialog = false;
    this.submitted = false;
  }

  deleteSelectedUsuarios() {
    this.deleteUsuariosDialog = true;
}

onGlobalFilter(table: Table, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}

convertToDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  // Ajusta la fecha a la zona horaria de Colombia (GMT-5)
  date.setHours(date.getHours() - 5);
  return date;
}

editUsuario(usuario: Usuarios) {
  this.usuario = { ...usuario };
  this.usuario.nacionalidad = {name: usuario.nacionalidad, code: usuario.nacionalidad == "Ecuatoriana" ? '1' : '2' };
  this.usuario.genero = {name: usuario.genero, code: usuario.genero == "Masculino" ? '1' : '2' };
  this.usuario.fecha_nacimiento = this.convertToDate(usuario.fecha_nacimiento);
  this.usuarioDialog = true;
}

deleteUsuarioDialog: boolean = false;
deleteAnioLectivo(usuario: Usuarios) {
  this.deleteUsuarioDialog = true;
  this.usuario = { ...usuario };
}

confirmDelete() {
  this.deleteUsuarioDialog = false;
  this.usuarios = this.usuarios.filter(val => val.id !== this.usuario.id);
  
  let ids = [
      this.usuario.id
  ]
  this.adminService.deleteUsuario(ids).subscribe({
      next:rest=>{
          
          if(rest['code']=="200"){
              this.usuario = {};
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado', life: 3000 });    
          }else{
              this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información' });
          }

      },error:e=>{
          window.location.reload();
          console.log(e);
      }
  })
  
}

deleteUsuario(usuario: Usuarios) {
  this.deleteUsuarioDialog = true;
  this.usuario = { ...usuario };
}

confirmDeleteSelected() {
  this.deleteUsuariosDialog = false;
  this.selectedUsuarios;
  let listaIds = this.selectedUsuarios.map(usuario => usuario.id);
  this.adminService.deleteUsuario(listaIds).subscribe({
      next:rest=> {
          
          if(rest['code']=="200"){
              this.usuarios = this.usuarios.filter(val => !this.selectedUsuarios.includes(val));
              this.selectedUsuarios = [];
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Años Lectivos eliminados', life: 3000 });
          }else{
              this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información' });
          }
          
      },error:e=>{
          console.log(e)
      }
  })
  
}

}
