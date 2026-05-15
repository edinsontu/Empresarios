import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, BehaviorSubject, tap } from 'rxjs';
import { environments } from '../../environments/environments';

export interface Carrito {
  clienteId: string;
  productos: any[];
  subtotal: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService { // Cambié el nombre a CarritoService por convención

  private API_URL = `${environments.API_BASE_URL}/carrito`;

  private carritoSubject = new BehaviorSubject<Carrito | null>(null);
  carrito$ = this.carritoSubject.asObservable();

  constructor(private http: HttpClient) { }

  private actualizarEstado(carrito: Carrito) {
    this.carritoSubject.next(carrito);
  }

  getCarrito(clienteId: string): Observable<Carrito> {
    return this.http.get<Carrito>(`${this.API_URL}/${clienteId}`).pipe(
      tap(carrito => this.actualizarEstado(carrito)),
      catchError(this.handleError)
    );
  }

  agregarProducto(clienteId: string, productoId: string, cantidad: number): Observable<Carrito> {
    const body = { clienteId, productoId, cantidad };
    return this.http.post<Carrito>(`${this.API_URL}/agregar`, body).pipe(
      tap(carrito => this.actualizarEstado(carrito)),
      catchError(this.handleError)
    );
  }

  actualizarCantidad(clienteId: string, productoId: string, nuevaCantidad: number): Observable<Carrito> {
    const body = { clienteId, productoId, nuevaCantidad };
    return this.http.put<Carrito>(`${this.API_URL}/actualizar`, body).pipe(
      tap(carrito => this.actualizarEstado(carrito)),
      catchError(this.handleError)
    );
  }

  eliminarProducto(clienteId: string, productoId: string): Observable<Carrito> {
    return this.http.post<Carrito>(`${this.API_URL}/eliminar`, { clienteId, productoId }).pipe(
      tap(carrito => this.actualizarEstado(carrito)),
      catchError(this.handleError)
    );
  }

  vaciarCarrito(clienteId: string): Observable<any> {
    return this.http.request('delete', `${this.API_URL}/vaciar`, { body: { clienteId } }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Error en el servicio de carrito:', error);
    return throwError(() => new Error(error.error?.message || 'Error en el servidor'));
  }
}