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
      this.authService.registerEmprendedor(this.emprendedor).subscribe({
        next: (res) => {
          this.alertService.success('Emprendedor registrado con éxito');
          this.router.navigate(['/login']);
          console.log(res);
        },
        error: (err) => {
          this.alertService.error('Error','Error al registrar emprendedor');
          console.error(err);
        }
      });
    }
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
