import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {
  private API_URL = `${environments.API_BASE_URL}/direcciones`;

  constructor(private http: HttpClient) { }

  getDirecciones(clienteId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/getDirecciones/${clienteId}`);
  }

  crearDireccion(direccion: any): Observable<any> {
    return this.http.post(`${this.API_URL}/crearDireccion`, direccion);
  }

}