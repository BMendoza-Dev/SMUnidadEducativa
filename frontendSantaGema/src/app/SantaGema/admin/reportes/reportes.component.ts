import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../service/admin.service';
import { MessageService } from 'primeng/api';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { takeUntil, switchMap, tap } from 'rxjs/operators';
import { ALectivo, Curso } from '../../service/interface';
import { appConfig } from 'src/app/config';
import { Table } from 'primeng/table';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
  providers: [MessageService]
})
export class ReportesComponent implements OnInit, OnDestroy {
  form: FormGroup;
  dataTableEstudiantes: any[] = [];
  cols: any[] = [];
  rowsInit = appConfig.rowsInit;
  globalFilterFields: any[] = [];
  rowsPerPageOptions = appConfig.rowsPerPageOptions;
  private destroy$ = new Subject<void>();
  private allAlectivos$ = new BehaviorSubject<ALectivo[]>([]);
  private allCursos$ = new BehaviorSubject<Curso[]>([]);
  filteredAnioLectivos$: Observable<ALectivo[]> = this.allAlectivos$.asObservable();
  filteredCursos$: Observable<Curso[]> = this.allCursos$.asObservable();
  readonly SELECT_ALL: ALectivo & Curso = { id: 0, nombre: 'Seleccionar Todos' };

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {
    this.form = this.fb.group({
      anio: [null, Validators.required],
      curso: [{ value: null, disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAlectivos();
    this.initializeDataTable();
    this.form.get('anio')!.valueChanges
      .pipe(
        tap(a => {
          this.form.get('curso')!.reset();
          this.allCursos$.next([]);
          if (a?.id === this.SELECT_ALL.id) {
            this.form.get('curso')!.disable();
          } else {
            this.form.get('curso')!.enable();
          }
        }),
        switchMap((a: ALectivo) => {
          if (a?.id === this.SELECT_ALL.id) {
            return of([this.SELECT_ALL]);
          }
          return this.adminService.getCursosPorAnioLectivo(a.id).pipe(
            tap(res => {
              if (res.code === 200) {
                this.allCursos$.next([this.SELECT_ALL, ...res.message]);
              } else {
                this.allCursos$.next([this.SELECT_ALL]);
                this.messageService.add({ severity: 'info', summary: 'Aviso', detail: 'No hay cursos' });
              }
            }),
            switchMap(res => of([this.SELECT_ALL, ...(res.code === 200 ? res.message : [])]))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(list => this.allCursos$.next(list));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeDataTable(): void {
    this.cols = [
      { field: 'matriculaNum', header: 'Número de Matrícula', type: 'text', maxWidth: '10%' },
      { field: 'estudiante.usuario.cedula', header: 'Cédula', type: 'text', maxWidth: '30%' },
      { field: 'estudiante.usuario.apellidos', header: 'Apellidos', type: 'text', maxWidth: '30%' },
      { field: 'estudiante.usuario.nombres', header: 'Nombres', type: 'text', maxWidth: '30%' },
      { field: 'anio_lectivo.nombre', header: 'Año Lectivo', type: 'text', maxWidth: '10%' },
      { field: 'curso.nombre', header: 'Curso', type: 'text', maxWidth: '10%' }
    ];
    this.globalFilterFields = this.generateGlobalFilterFields();
  }

  private generateGlobalFilterFields(): string[] {
    return this.cols
      .filter(col => col.type === 'text')
      .map(col => col.field);
  }

  private loadAlectivos(): void {
    this.adminService.getUniqueAnioLectivos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => this.allAlectivos$.next([this.SELECT_ALL, ...res.message]),
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar años' })
      });
  }

  onSearch(type: 'anio' | 'curso', query: string): void {
    const source = type === 'anio' ? this.allAlectivos$.value : this.allCursos$.value;
    const filtered = source.filter(item =>
      item.nombre.toLowerCase().startsWith(query.toLowerCase())
    );
    if (type === 'anio') {
      this.allAlectivos$.next(filtered);
    } else {
      this.allCursos$.next(filtered);
    }
  }

  cargarEstudiantes(): void {
    this.spinner.show();
    const anio = this.form.get('anio')!.value;
    const curso = this.form.get('curso')!.value;

    // Verificamos que tengan ID válido, y si no, enviamos 0
    const payload = {
      anio_lectivo_id: anio?.id || 0,
      curso_id: curso?.id || 0
    };

    this.adminService.getEstudiantesPorAnioYCurso(payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.code === 200) {
          this.dataTableEstudiantes = res.data;
        } else {
          this.dataTableEstudiantes = [];
          this.messageService.add({ severity: 'info', summary: 'Aviso', detail: 'No hay estudiantes' });
        }
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error al obtener estudiantes:', err);
        this.spinner.hide();
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  generarCertifiado(matricula: any, tipo: string) {
    if (tipo === 'matricula') {
      this.adminService.getCertificadoPdf(matricula.matriculaId).subscribe({
        next: (res) => {
          const url = window.URL.createObjectURL(res);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${matricula.matriculaNum}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        error: (err) => {
          console.error('Error al obtener certificado:', err);
        }
      });
    } else {
      this.adminService.getCertificadoPdf(matricula.id).subscribe({
        next: (pdfBlob) => {
          const blobUrl = URL.createObjectURL(pdfBlob);
          window.open(blobUrl, '_blank');
        },
        error: (err) => {
          console.error('Error al generar el PDF:', err);
        }
      });
    }
  }

}