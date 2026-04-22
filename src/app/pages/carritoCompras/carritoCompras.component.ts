import { Component, OnInit } from '@angular/core';
import { CarritoService, Carrito } from '../../services/carritoCompras.service'; // Ajusta la ruta
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carritoCompras.component.html',
  styleUrls: ['./carritoCompras.component.css'],
  imports: [CommonModule],
})
export class CarritoComponent implements OnInit {
  carrito: Carrito | null = null;
  clienteId: string = '';
  cargando: boolean = true;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private router: Router,
    private pedidoService: PedidoService,
  ) {}

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
    const usuario = this.authService.getUsuarioActual();
    const clienteId = localStorage.getItem('clienteId');

    if (!clienteId) return;

    this.pedidoService.crearOrden(clienteId).subscribe({
      next: (ordenCreada) => {
        this.pedidoService.configurarYAbrirCheckout(ordenCreada.orden, usuario);
      },
      error: (err) => {
        console.error('Error al crear la orden', err);
        alert('No pudimos procesar tu pedido, intenta más tarde.');
      },
    });
  }

  cambiarCantidad(
    productoId: string,
    cantidadActual: number,
    cambio: number,
  ): void {
    const nuevaCantidad = cantidadActual + cambio;
    if (nuevaCantidad < 1) return;

    this.carritoService
      .actualizarCantidad(this.clienteId, productoId, nuevaCantidad)
      .subscribe({
        next: (res) => (this.carrito = res),
        error: (err) => alert('Error al actualizar: ' + err.message),
      });
  }

  eliminarProducto(productoId: string): void {
    if (confirm('¿Estás seguro de quitar este producto?')) {
      this.carritoService
        .eliminarProducto(this.clienteId, productoId)
        .subscribe({
          next: (res) => (this.carrito = res),
          error: (err) => console.error(err),
        });
    }
  }

  irProductos() {
    this.router.navigate(['/cliente/dashboard']);
  }

  vaciarCarrito(): void {
    if (confirm('¿Deseas vaciar todo tu carrito?')) {
      this.carritoService.vaciarCarrito(this.clienteId).subscribe({
        next: () => (this.carrito = null),
        error: (err) => console.error(err),
      });
    }
  }
}
