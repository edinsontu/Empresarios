import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emprendedor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './emprendedor.component.html',
  styleUrl: './emprendedor.component.css'
})
export class RegisterEmprendedorComponent {
  emprendedor = {
    name: '',
    nameEmprendimiento: '',
    email: '',
    tel: '',
    password: ''
  };

  constructor(private router: Router, private alertService: AlertService) {}


  authService = inject(AuthService);

  onSubmit() {
    if (this.emprendedor.name && this.emprendedor.nameEmprendimiento && this.emprendedor.email && this.emprendedor.password) {
      const payload = {
        ...this.emprendedor,
        name: this.emprendedor.name.trim(),
        nameEmprendimiento: this.emprendedor.nameEmprendimiento.trim(),
        email: this.emprendedor.email.trim().toLowerCase(),
      };

      this.authService.registerEmprendedor(payload).subscribe({
        next: (res) => {
          this.alertService.success('Emprendedor registrado con éxito');
          this.router.navigate(['/login']);
          console.log(res);
        },
        error: (err) => {
          const backendMessage = err?.error?.message || err?.error?.error || 'Error al registrar emprendedor';
          this.alertService.error('Error', backendMessage);
          console.error(err);
        }
      });
    }
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
