import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json'
    // });

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

  deleteALectivo(id:number): Observable<any>{
    debugger
    return this.http.delete<any>(`${this.apiUrl}deleteALectivo/${id}`);
  }

}
