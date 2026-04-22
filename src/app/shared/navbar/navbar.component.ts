import { Component, OnInit } from '@angular/core';
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

  constructor(
    private authService: AuthService,
    private router: Router,
    protected carritoService: CarritoService,
  ) {}

  ngOnInit(): void {
    this.authService.loginStatus$.subscribe((status) => {
      this.estaLogueado = status;

      if (status) {
        const usuario = this.authService.getUsuarioActual();
        this.nombreUsuario = usuario?.name || 'Usuario';

        const idClient = localStorage.getItem('clienteId');
        const idEmrependedor = localStorage.getItem('emprendedorId');
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
