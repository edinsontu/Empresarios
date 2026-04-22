import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

export interface Cliente {
  name: string;
  email: string;
  tel: string;
  password: string;
}

export interface Emprendedor {
  name: string;
  nameEmprendimiento: string;
  email: string;
  tel: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Tu URL del backend
  private isBrowser: boolean;
  private loginStatus: BehaviorSubject<boolean>;
  loginStatus$: Observable<boolean>;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loginStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
    this.loginStatus$ = this.loginStatus.asObservable();
  }

  getEmprendedorId(): string | null {
    return this.isBrowser ? localStorage.getItem('emprendedorId') : null;
  }

  isLoggedIn(): boolean {
    return !!this.getUsuarioActual();
  }

  // Registrar Cliente
  registerCliente(cliente: Cliente): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes/register`, cliente);
  }

  // Registrar Emprendedor
  registerEmprendedor(emprendedor: Emprendedor): Observable<any> {
    return this.http.post(`${this.apiUrl}/emprendedores/register`, emprendedor);
  }

  // Iniciar Sesión
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((respuesta: any) => {
        const usuario = respuesta.usuario; // Asegúrate que coincide con tu backend
        if (usuario.tipo === 'emprendedor') {
          localStorage.setItem('emprendedorId', usuario._id);
        } else {
          localStorage.setItem('clienteId', usuario._id);
        }
        this.guardarUsuarioActual(usuario);
      })
    );
  }

  guardarUsuarioActual(usuario: any) {
    if (this.isBrowser) {
      localStorage.setItem('usuarioActual', JSON.stringify(usuario));
      this.loginStatus.next(true);
    }
  }

  getUsuarioActual() {
    if (this.isBrowser) {
      const usuario = localStorage.getItem('usuarioActual');
      return usuario ? JSON.parse(usuario) : null;
    }
    return null;
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('usuarioActual');
      localStorage.removeItem('emprendedorId');
      localStorage.removeItem('clienteId');
      this.loginStatus.next(false);
    }
  }
}