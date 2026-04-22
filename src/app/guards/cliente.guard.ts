import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const usuario = this.authService.getUsuarioActual();
    if (usuario && usuario.tipo === 'cliente') {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
