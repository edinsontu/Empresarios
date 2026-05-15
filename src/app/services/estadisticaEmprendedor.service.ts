// emprendedor.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class EmprendedorService {
  private http = inject(HttpClient);
  private url = `${environments.API_BASE_URL}/estadisticasEmprendedor`;

  getStats(id: string): Observable<any> {
    return this.http.get(`${this.url}/estadisticas/${id}`);
  }

  getPedidosPendientes(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/pedidos-pendientes/${id}`);
  }
}