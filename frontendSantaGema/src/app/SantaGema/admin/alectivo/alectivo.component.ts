import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, Message } from 'primeng/api';
import { Table } from 'primeng/table';
import { Customer, Representative } from 'src/app/demo/api/customer';
import { Product } from 'src/app/demo/api/product';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { ProductService } from 'src/app/demo/service/product.service';
import {ALectivo} from 'src/app/SantaGema/service/interface'
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-alectivo',
  templateUrl: './alectivo.component.html',
  styleUrls: ['./alectivo.component.scss'],
  providers: [MessageService]
})
export class ALectivoComponent implements OnInit{

    constructor(private adminService:AdminService, private messageService: MessageService
    ) { }

    nomALectivo:any="";
    fechIni:any="";
    fechFin:any="";
    formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    clearVariable(){
        this.nomALectivo = "";
        this.fechIni="";
        this.fechFin="";
        this.validatedForm = false;
    }

    validatedForm:boolean=false;

    anioLectivoDialog: boolean = false;

    deleteAnioLectivoDialog: boolean = false;

    deleteAnioLectivosDialog: boolean = false;

    anioLectivos: ALectivo[] = [];

    anioLectivo: ALectivo = {};

    selectedAnioLectivos: ALectivo[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    ngOnInit() {
        this.adminService.getListALectivo().subscribe(data => this.anioLectivos = data['message']);

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'anioInicio', header: 'Año Inicio' },
            { field: 'anioFin', header: 'Año Fin' }
        ];
    }

    openNew() {
        this.anioLectivo = {};
        this.submitted = false;
        this.anioLectivoDialog = true;
    }

    deleteSelectedAnioLectivos() {
        this.deleteAnioLectivosDialog = true;
    }

    editAnioLectivo(anioLectivo: ALectivo) {
        this.anioLectivo = { ...anioLectivo };
        this.anioLectivoDialog = true;
    }

    deleteAnioLectivo(anioLectivo: ALectivo) {
        this.deleteAnioLectivoDialog = true;
        this.anioLectivo = { ...anioLectivo };
    }

    confirmDelete() {
        this.deleteAnioLectivoDialog = false;
        this.anioLectivos = this.anioLectivos.filter(val => val.id !== this.anioLectivo.id);
        
        let ids = [
            this.anioLectivo.id
        ]
        this.adminService.deleteALectivo(ids).subscribe({
            next:rest=>{
                
                if(rest['code']=="200"){
                    this.anioLectivo = {};
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
        this.deleteAnioLectivosDialog = false;
        this.selectedAnioLectivos; 
        let listaIds = this.selectedAnioLectivos.map(anio => anio.id);
        this.adminService.deleteALectivo(listaIds).subscribe({
            next:rest=> {
                
                if(rest['code']=="200"){
                    this.anioLectivos = this.anioLectivos.filter(val => !this.selectedAnioLectivos.includes(val));
                    this.selectedAnioLectivos = [];
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Años Lectivos eliminados', life: 3000 });
                }else{
                    this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Error al procesar la información' });
                }
                
            },error:e=>{
                console.log(e)
            }
        })
        
    }

    hideDialog() {
        this.anioLectivoDialog = false;
        this.submitted = false;
    }

    saveAnioLectivo() {
        this.submitted = true;
        this.validatedForm = true
        if (this.anioLectivo.id) {
            if(this.anioLectivo.nombre && this.anioLectivo.anioInicio && this.anioLectivo.anioFin){
                this.anioLectivos[this.findIndexById(this.anioLectivo.id)] = this.anioLectivo;
                this.adminService.updateALectivo(this.anioLectivo).subscribe({
                    next:rest => {
                        
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Año Lectivo actualizado', life: 3000 });    
                        this.anioLectivos = [...this.anioLectivos];
                        this.anioLectivoDialog = false;
                        this.anioLectivo = {};    
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
            this.anioLectivo = {
                nombre: this.nomALectivo,
                anioInicio:this.formatDate(this.fechIni),
                anioFin:this.formatDate(this.fechFin)
            }
            if(this.anioLectivo.anioFin != "" && this.anioLectivo.anioInicio != "" && this.anioLectivo.nombre != ""){
                this.adminService.registerALectivo(this.anioLectivo).subscribe({
                    next:rest=>{
                        if(rest.code == "200"){
                            this.anioLectivo.id = rest.id;
                            this.anioLectivos.push(this.anioLectivo);                
                            this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Se proceso correctamente' });
                            this.anioLectivos = [...this.anioLectivos];
                            this.anioLectivoDialog = false;
                            this.anioLectivo = {};  
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
        for (let i = 0; i < this.anioLectivos.length; i++) {
            if (this.anioLectivos[i].id === id) {
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
