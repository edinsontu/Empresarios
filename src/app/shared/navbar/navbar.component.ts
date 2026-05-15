import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carritoCompras.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  estaLogueado: boolean = false;
  nombreUsuario: string = '';
  dropdownVisible = false;
  isClient: boolean = false;
  private isBrowser: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    protected carritoService: CarritoService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private safeGetLocalStorage(key: string): string | null {
    if (!this.isBrowser) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  ngOnInit(): void {
    this.authService.loginStatus$.subscribe((status) => {
      this.estaLogueado = status;

      if (status) {
        const usuario = this.authService.getUsuarioActual();
        this.nombreUsuario = usuario?.name || 'Usuario';

        const idClient = this.safeGetLocalStorage('clienteId');
        const idEmrependedor = this.safeGetLocalStorage('emprendedorId');
        if (idClient) {
          this.carritoService.getCarrito(idClient).subscribe();
          this.isClient = true;
        }
        if (idEmrependedor) {
          this.isClient = false;
        }
      } else {
        this.nombreUsuario = '';
        this.dropdownVisible = false;
      }
    });
  }

  irAInicio() {
    this.router.navigate(['/']);
  }

  irARegistro() {
    this.router.navigate(['/register']);
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  cerrarDropdown() {
    this.dropdownVisible = false;
  }

  irAPerfil() {
    this.router.navigate(['/perfil']);
    this.cerrarDropdown();
  }

  irAProductos() {
    this.router.navigate(['/productos']);
    this.cerrarDropdown();
  }

  irCarrito() {
    this.router.navigate(['/carrito']);
    this.cerrarDropdown();
  }
}
