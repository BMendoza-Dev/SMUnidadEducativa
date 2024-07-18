import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dE } from '@fullcalendar/core/internal-common';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = environment.apiLocalHost;

  constructor(private http: HttpClient) { }

  // getDatos(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/ruta-get`);
  // }

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

  updateALectivo(datos:any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('nombre', datos.nombre); // Agrega otros datos aquí
    formData.append('anioInicio', datos.anioInicio);
    formData.append('anioFin', datos.anioFin);
    formData.append('id',datos.id);

    return this.http.post<any>(`${this.apiUrl}updateALectivo`, formData);
  }

  deleteALectivo(ids:number[]): Observable<any>{
    
    const body = { ids: ids }; // Crea un objeto con un campo 'ids' que contiene la lista de IDs
    return this.http.post<any>(`${this.apiUrl}deleteALectivo`, body);
    // return this.http.delete<any>(`${this.apiUrl}deleteALectivo/${id}`);
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
    formData.append('id',datos.id);

    return this.http.post<any>(`${this.apiUrl}updateCurso`, formData);
  }

  deleteCurso(ids:number[]): Observable<any>{
    
    const body = { ids: ids }; // Crea un objeto con un campo 'ids' que contiene la lista de IDs
    return this.http.post<any>(`${this.apiUrl}deleteCurso`, body);
    // return this.http.delete<any>(`${this.apiUrl}deleteALectivo/${id}`);
  }

}
