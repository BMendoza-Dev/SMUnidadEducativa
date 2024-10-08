import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dE } from '@fullcalendar/core/internal-common';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Representante, Usuarios } from './interface';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = environment.apiLocalHost;

  constructor(private http: HttpClient) { }

  registerALectivo(datos: any): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('nombre', datos.nombre); // Agrega otros datos aquí
    formData.append('anioInicio', datos.anioInicio);
    formData.append('anioFin', datos.anioFin);

    return this.http.post<any>(`${this.apiUrl}registerALectivo`, formData);
  }

  getListALectivo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getListALectivo`);
  }

  getUniqueAnioLectivos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getUniqueAnioLectivos`);
  }

  updateALectivo(datos: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('nombre', datos.nombre); // Agrega otros datos aquí
    formData.append('anioInicio', datos.anioInicio);
    formData.append('anioFin', datos.anioFin);
    formData.append('id', datos.id);

    return this.http.post<any>(`${this.apiUrl}updateALectivo`, formData);
  }

  deleteALectivo(ids: number[]): Observable<any> {
    const body = { ids: ids }; // Crea un objeto con un campo 'ids' que contiene la lista de IDs
    return this.http.post<any>(`${this.apiUrl}deleteALectivo`, body);
  }

  getListCurso(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getListCurso`);
  }

  registerCurso(datos: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('nombre', datos.nombre);

    return this.http.post<any>(`${this.apiUrl}registerCurso`, formData);
  }

  updateCurso(datos: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('nombre', datos.nombre);
    formData.append('id', datos.id);

    return this.http.post<any>(`${this.apiUrl}updateCurso`, formData);
  }

  deleteCurso(ids: number[]): Observable<any> {
    const body = { ids: ids }; // Crea un objeto con un campo 'ids' que contiene la lista de IDs
    return this.http.post<any>(`${this.apiUrl}deleteCurso`, body);
  }

  consultarCedula(cedula: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}consultarCedula/${cedula}`);
  }

  registrarUsuario(datos: Usuarios): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('cedula', datos.cedula);
    formData.append('nombres', datos.nombres);
    formData.append('apellidos', datos.apellidos);
    formData.append('nacionalidad', datos.nacionalidad);
    formData.append('genero', datos.genero);
    formData.append('fecha_nacimiento', datos.fecha_nacimiento);

    return this.http.post<any>(`${this.apiUrl}registrarUsuario`, formData);
  }

  getListUsuario(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getListUsuario`);
  }

  deleteUsuario(ids: number[]): Observable<any> {
    const body = { ids: ids }; // Crea un objeto con un campo 'ids' que contiene la lista de IDs
    return this.http.post<any>(`${this.apiUrl}deleteUsuario`, body);
  }

  updateUsuario(datos: any): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('id', datos.id);
    formData.append('cedula', datos.cedula);
    formData.append('nombres', datos.nombres);
    formData.append('apellidos', datos.apellidos);
    formData.append('nacionalidad', datos.nacionalidad);
    formData.append('genero', datos.genero);
    formData.append('fecha_nacimiento', datos.fecha_nacimiento);

    return this.http.post<any>(`${this.apiUrl}updateUsuario`, formData);
  }

  getUsuarioMatricula(cedula: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getUsuarioMatricula/${cedula}`);
  }

  getRepresentante(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getRepresentante/${id}`);
  }

  getEstudiante(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getEstudiante/${id}`);
  }

  createRepresentante(datos: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('parentesco', datos.parentesco);
    formData.append('correo', datos.correo);
    formData.append('telefono', datos.telefono);
    formData.append('direccion', datos.direccion);
    formData.append('usuario_id', datos.usuarios.id);

    return this.http.post<any>(`${this.apiUrl}createRepresentante`, formData);
  }

  updateRepresentante(datos: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}updateRepresentante`, datos);
  }

  updateEstudiante(datos: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}updateEstudiante`, datos);
  }

  createEstudiante(datos: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('correo', datos.correo);
    formData.append('telefono', datos.telefono);
    formData.append('direccion', datos.direccion);
    formData.append('usuario_id', datos.usuarios.id);

    return this.http.post<any>(`${this.apiUrl}createEstudiante`, formData);
  }

  createMatricula(datos: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}createMatricula`, datos);
  }

  updateMatricula(datos: any, id): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}updateMatricula/${id}`, datos)
  }

  getMatriculasByAnioAndCurso(datos: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}getMatriculasByAnioAndCurso`, datos);
  }

  getMatriculasByAnioAndCursoParaMaterias(datos: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}getMatriculasByAnioAndCursoParaMaterias`, datos);
  }

  deleteMatricula(ids: number[]): Observable<any> {
    const body = { ids: ids }; // Crea un objeto con un campo 'ids' que contiene la lista de IDs
    return this.http.post<any>(`${this.apiUrl}deleteMatricula`, body);
  }

  getSRI(text: string): Observable<any> {
    let apiUrl = `https://srienlinea.sri.gob.ec/movil-servicios/api/v1.0/deudas/porDenominacion/${text}/?tipoPersona=N&resultados=30&_=1725890063711`;
    return this.http.get(apiUrl);
  }

  getListMateria(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getListMateria`);
  }

  registerMateria(datos: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('nombre', datos.nombre);

    return this.http.post<any>(`${this.apiUrl}registerMateria`, formData);
  }

  updateMateria(datos: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('nombre', datos.nombre);

    return this.http.post<any>(`${this.apiUrl}updateMateria/${datos.id}`, formData);
  }

  deleteMateria(ids: number[]): Observable<any> {
    const body = { ids: ids }; // Crea un objeto con un campo 'ids' que contiene la lista de IDs
    return this.http.post<any>(`${this.apiUrl}deleteMateria`, body);
  }

  attachMateriasToCursoInAnioLectivo(anio_lectivo_id, curso_id, materia_ids: any[]): Observable<any> {
    const materiaMap_ids = materia_ids.map(materia => materia.id);
    const body = {
      anio_lectivo_id: anio_lectivo_id.id,
      curso_id: curso_id.id,
      materia_ids: materiaMap_ids
    }
    return this.http.post<any>(`${this.apiUrl}attachMateriasToCursoInAnioLectivo`, body);
  }

  getCursosPorAnioLectivo(anioLectivoId): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getCursosPorAnioLectivo/${anioLectivoId}`);
  }

  getMateriasPorCursoYAnioLectivo(anioLectivoId, cursoId): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getMateriasPorCursoYAnioLectivo/${anioLectivoId}/${cursoId}`);
  }

  updateMateriasForCursoInAnioLectivo(anio_lectivo_id, curso_id, materia_ids: any[]): Observable<any> {
    const materiaMap_ids = materia_ids.map(materia => materia.id);
    const body = {
      anio_lectivo_id: anio_lectivo_id.id,
      curso_id: curso_id.id,
      materia_ids: materiaMap_ids
    }
    return this.http.post<any>(`${this.apiUrl}updateMateriasForCursoInAnioLectivo`, body);
  }

  agregarNota(idMatricula: any, notas: any): Observable<any> {

    let datos = notas['materias'].map(nota => ({
      materia_id: nota.id,
      calificacion: nota.nota
    }))

    datos = {
      "materias": datos,
      "matricula_id": idMatricula,
    }

    return this.http.post<any>(`${this.apiUrl}agregarNota`, datos);
  }

  obtenerNotas(matriculaId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}obtenerNotas/${matriculaId}`);
  }

  generarDNI():Observable<any> {
    return this.http.get<any>(`${this.apiUrl}generarDNI`);

  }

}
