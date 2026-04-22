import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carritoCompras.service'; // 1. Importar servicio
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  productos: any[] = [];
  productosFiltrados: any[] = [];
  busqueda: string = '';
  clienteId: string = ''; 

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService
  ) { }

  ngOnInit() {
    const storedId = localStorage.getItem('clienteId');
    if (storedId) this.clienteId = storedId;

    this.productoService.getTodosLosProductos().subscribe(
      res => {
        this.productos = res;
        this.productosFiltrados = res;
      },
      err => console.error(err)
    );
  }

  agregarAlCarrito(producto: any) {
    if (!this.clienteId) {
      alert('Debes iniciar sesión para agregar productos.');
      return;
    }

    this.carritoService.agregarProducto(this.clienteId, producto._id, 1).subscribe({
      next: (res) => {
        alert(`¡${producto.nombre} agregado al carrito!`);
      },
      error: (err) => {
        console.error(err);
        alert('Error al agregar al carrito');
      }
    });
  }

  filtrarProductos() {
    const termino = this.busqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(termino) ||
      p.emprendedorId?.name?.toLowerCase().includes(termino)
    );
  }

  generarLinkWhatsApp(telefono: string): string {
    if (!telefono) return '#';
    let numero = telefono.replace(/\D/g, '');
    if (!numero.startsWith('57')) {
      numero = '57' + numero;
    }
    return `https://wa.me/${numero}`;
  }
}