import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class EnvioService {
  private API_URL = `${environments.API_BASE_URL}/envios`;

  constructor(private http: HttpClient) {}

  crearRegistroEnvio(datosEnvio: any): Observable<any> {
    return this.http.post(this.API_URL, datosEnvio);
  }

  getEnviosCliente(clienteId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/cliente/${clienteId}`);
  }

  getPuntosRecogida(): Observable<any[]> {
    const puntos = [
      {
        _id: '662ad7c1e4b0f1a2c3d4e5f1',
        nombre: 'Punto Central (Calle 45 #10-20)',
        ciudad: 'Bogotá',
        costo: 0,
      },
      {
        _id: '662ad7c1e4b0f1a2c3d4e5f2',
        nombre: 'Sede Norte (Av. Siempre Viva 123)',
        ciudad: 'Bogotá',
        costo: 0,
      },
      {
        _id: '662ad7c1e4b0f1a2c3d4e5f3',
        nombre: 'Locker Inteligente - CC Unicentro',
        ciudad: 'Bogotá',
        costo: 2000,
      },
    ];
    return of(puntos);
  }
}
