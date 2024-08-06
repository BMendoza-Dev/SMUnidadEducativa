import { Component, OnInit } from '@angular/core';
import { CountryService } from 'src/app/demo/service/country.service';
import { AdminService } from '../../service/admin.service';
import { Curso } from '../../service/interface';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { dE } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss'],
  providers: [MessageService]
})
export class CursosComponent implements OnInit{
  anioLectivosSelect:any[] = [];

  constructor(private adminService: AdminService, private messageService: MessageService){}

  ngOnInit(): void {
    this.adminService.getListALectivo().subscribe({
      next:rest=>{
        this.anioLectivosSelect = rest['message'];
      },error:e=>{
        console.log(e);
      }
    })
    this.adminService.getListCurso().subscribe({
        next:data=>{
            this.cursos = data['message'];
            
            this.cols = [
                { field: 'id', header: 'ID' },
                { field: 'nombre', header: 'Nombre' },
            ];
        }
    }) 
  }

  //CRUD

    nomCurso:any="";

    clearVariable(){
        this.nomCurso = "";
        this.validatedForm = false;
    }

    validatedForm:boolean=false;

    cursoDialog: boolean = false;

    deleteCursoDialog: boolean = false;

    deleteCursosDialog: boolean = false;

    cursos: Curso[] = [];

    curso: Curso = {};

    selectedCursos: Curso[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    openNew() {
        this.curso = {};
        this.submitted = false;
        this.cursoDialog = true;
    }

    deleteSelectedCursos() {
        this.deleteCursosDialog = true;
    }

    editCurso(curso: Curso) {
        this.curso = { ...curso };
        this.cursoDialog = true;
    }

    deleteCurso(curso: Curso) {
        this.deleteCursoDialog = true;
        this.curso = { ...curso };
    }

    confirmDelete() {
        this.deleteCursoDialog = false;
        this.cursos = this.cursos.filter(val => val.id !== this.curso.id);
        let ids = [
            this.curso.id
        ]
        this.adminService.deleteCurso(ids).subscribe({
            next:rest=>{
                if(rest['code']=="200"){
                    this.curso = {};
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Año Lectivo eliminado', life: 3000 });    
                }else{
                    this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información' });
                }
            },error:e=>{
                window.location.reload();
                console.log(e);
            }
        })
        
    }

    confirmDeleteSelected() {
        this.deleteCursosDialog = false;
        this.selectedCursos; 
        let listaIds = this.selectedCursos.map(curso => curso.id);
        this.adminService.deleteCurso(listaIds).subscribe({
            next:rest=> {
                if(rest['code']=="200"){
                    this.cursos = this.cursos.filter(val => !this.selectedCursos.includes(val));
                    this.selectedCursos = [];
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cursos eliminados', life: 3000 });
                }else{
                    this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información' });
                }
                
            },error:e=>{
                console.log(e)
            }
        })
        
    }

    hideDialog() {
        this.cursoDialog = false;
        this.submitted = false;
    }

    saveCurso() {
        this.submitted = true;
        this.validatedForm = true
        if (this.curso.id) {
            if(this.curso.nombre != ""){
                this.cursos[this.findIndexById(this.curso.id)] = this.curso;
                this.adminService.updateCurso(this.curso).subscribe({
                    next:rest => {
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Curso actualizado', life: 3000 });    
                        this.cursos = [...this.cursos];
                        this.cursoDialog = false;
                        this.curso = {};
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
            this.curso = {
                nombre: this.nomCurso,
            }
            
            if(this.curso.nombre != ""){
                this.adminService.registerCurso(this.curso).subscribe({
                    next:rest=>{
                        if(rest.code == "200"){
                            console.log("Se guardo correctamente");
                            this.curso.id = rest.id;
                            this.cursos.push(this.curso);                
                            this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Se proceso correctamente' });
                            this.cursos = [...this.cursos];
                            this.cursoDialog = false;
                            this.curso = {};
                            this.validatedForm = false;
                        }else{
                            window.location.reload();
                            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información' });
                        }
                        this.clearVariable();
                    },error:e=>{
                        setTimeout(() => {
                            window.location.reload();
                            console.log(e);
                        }, 2000);
                        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información' });
                    }
                })
            }else{
                this.validatedForm=true;
                this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Alerta!', detail: 'Existe campos vacios' });
            }
        }
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.cursos.length; i++) {
            if (this.cursos[i].id === id) {
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
