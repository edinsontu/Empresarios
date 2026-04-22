import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environments } from '../../environments/environments';

// URL del backend Node.js
const API_URL = `${environments.API_BASE_URL}/productos`;

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient) { }

  // Obtener todos los productos de un emprendedor
  getProductosPorEmprendedor(emprendedorId: string): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/emprendedor/${emprendedorId}`); // 👈 Asegúrate que coincida con tu ruta en Express
  }

  getTodosLosProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}`);
  }

  // Agregar nuevo producto
  agregarProducto(producto: any): Observable<any> {
    return this.http.post(API_URL, producto).pipe(
      catchError(error => {
        console.error('Error al agregar producto:', error);
        return throwError(error);
      })
    );
  }

  // Eliminar un producto por su ID
  eliminarProducto(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }

  // Actualizar un producto (por ID y nuevos datos)
  actualizarProducto(id: string, datos: any): Observable<any> {
    return this.http.put(`${API_URL}/${id}`, datos);
  }
}
