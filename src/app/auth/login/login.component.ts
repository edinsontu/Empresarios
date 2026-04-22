import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Variables originales (sin cambios)
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  // Solo agregamos esta nueva variable
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  // Método original con el mínimo de modificaciones
  onLogin() {
    this.isLoading = true; // Nuevo estado de carga

    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe({
        next: (res) => {
          const usuario = this.authService.getUsuarioActual();
          if (usuario.tipo === 'emprendedor') {
            this.router.navigate(['/emprendedor/dashboard']);
          } else if (usuario.tipo === 'cliente') {
            this.router.navigate(['/cliente/dashboard']);
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      this.isLoading = false; // Desactivar carga
      this.errorMessage = 'Todos los campos son obligatorios.';
    }
  }

  togglePasswordVisibility(inputId: string) {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const toggleIcon = input.nextElementSibling as HTMLElement;

    if (input.type === 'password') {
      input.type = 'text';
      toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  }

  irARegistro() {
    this.router.navigate(['/register']);
  }
}