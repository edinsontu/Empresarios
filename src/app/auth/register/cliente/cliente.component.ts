import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class RegisterClienteComponent {
  cliente = {
    name: '',
    email: '',
    tel: '',
    password: ''
  };

  constructor(private router: Router, private alertService: AlertService) {}


  authService = inject(AuthService);

  onSubmit() {
    if (this.cliente.name && this.cliente.email && this.cliente.password) {
      this.authService.registerCliente(this.cliente).subscribe({
        next: (res) => {
          this.alertService.success('Cliente registrado con éxito');
          this.router.navigate(['/login']);
          console.log(res);
        },
        error: (err) => {
          this.alertService.error('Error','Error al registrar cliente');
          console.error(err);
        }
      });
    }
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
