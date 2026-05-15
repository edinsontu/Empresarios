import { Component, OnInit, inject } from '@angular/core';
import { CarritoService, Carrito } from '../../services/carritoCompras.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-carrito',
  standalone: true, // Asegúrate de si es standalone o no según tu proyecto
  templateUrl: './carritoCompras.component.html',
  styleUrls: ['./carritoCompras.component.css'],
  imports: [CommonModule],
})
export class CarritoComponent implements OnInit {
  private alertService = inject(AlertService);
  private carritoService = inject(CarritoService);
  private router = inject(Router);
  carrito: Carrito | null = null;
  clienteId: string = '';
  cargando: boolean = true;
  cantidadDisponible: number = 0;

  constructor() {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('clienteId');
    if (storedId) {
      this.clienteId = storedId;
      this.cargarCarrito();
    } else {
      this.cargando = false;
    }
  }

  cargarCarrito(): void {
    this.cargando = true;
    this.carritoService.getCarrito(this.clienteId).subscribe({
      next: (res) => {
        this.carrito = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      },
    });
  }

  procesarPago() {
    this.router.navigate(['/cliente/checkout-logistica']);
  }

  cambiarCantidad(
    productoId: string,
    cantidadActual: number,
    cambio: number,
  ): void {
    const nuevaCantidad = cantidadActual + cambio;

    if (nuevaCantidad < 1) return;

    const item = this.carrito?.productos.find(
      (p) => p.productoId._id === productoId,
    );
    const stockDisponible = item?.productoId?.cantidad || 0;

    if (nuevaCantidad > stockDisponible) {
      this.alertService.error(
        `Lo sentimos, solo hay ${stockDisponible} unidades disponibles.`,
      );
      return;
    }

    this.carritoService
      .actualizarCantidad(this.clienteId, productoId, nuevaCantidad)
      .subscribe({
        next: (res) => (this.carrito = res),
        error: (err) =>
          this.alertService.error('Error al actualizar: ' + err.message),
      });
  }

  eliminarProducto(productoId: string): void {
    this.alertService
      .confirm('¿Estás seguro?', '¿Deseas eliminar este producto del carrito?')
      .then((confirmed) => {
        if (confirmed) {
          this.carritoService
            .eliminarProducto(this.clienteId, productoId)
            .subscribe({
              next: (res) => (this.carrito = res),
              error: (err) =>
                this.alertService.error('Error al eliminar: ' + err.message),
            });
        }
      });
  }

  irProductos() {
    this.router.navigate(['/cliente/dashboard']);
  }

  vaciarCarrito(): void {
    this.alertService
      .confirm('¿Estas seguro?', 'Esta acción vaciará tu carrito')
      .then((confirmed) => {
        if (confirmed) {
          this.carritoService.vaciarCarrito(this.clienteId).subscribe({
            next: () => (this.carrito = null),
            error: (err) =>
              this.alertService.error(
                'Error al vaciar el carrito: ' + err.message,
              ),
          });
        }
      });
  }
}
