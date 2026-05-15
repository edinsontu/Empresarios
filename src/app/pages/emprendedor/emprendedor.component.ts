import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth/auth.service';
import { AlertService } from '../../services/alert.service';
import { EmprendedorService } from '../../services/estadisticaEmprendedor.service'; // <-- IMPORTANTE: Agregar este import

@Component({
  selector: 'app-dashboard-emprendedor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emprendedor.component.html',
  styleUrls: ['./emprendedor.component.css'],
})
export class EmprendedorComponent implements OnInit {
  productos: any[] = [];
  mostrarFormulario = false;
  @ViewChild('formularioProducto') formularioProducto!: ElementRef<HTMLDivElement>;
  editando = false;
  productoEditandoId: string | null = null;
  emprendedorId: string = '';

  stats = {
    totalVendido: 0,
    totalClientes: 0,
    pedidosCompletados: 0,
  };
  pedidosPendientes: any[] = [];
  productoEstrella: string = 'Calculando...';

  nuevoProducto = {
    nombre: '',
    precio: null as number | null,
    descripcion: '',
    cantidad: 0,
    imagen: '',
    emprendedorId: '',
  };

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private alertService: AlertService,
    private emprendedorService: EmprendedorService,
  ) {}

  ngOnInit() {
    const emprendedorId = this.authService.getEmprendedorId();
    if (emprendedorId) {
      this.emprendedorId = emprendedorId;
      this.obtenerProductos(emprendedorId);
      this.cargarEstadisticas(emprendedorId);
      this.cargarPedidosPendientes(emprendedorId);
    } else {
      console.error('No se encontró emprendedorId en localStorage');
    }
  }

  cargarEstadisticas(id: string) {
    this.emprendedorService.getStats(id).subscribe({
      next: (res) => {
        this.stats = res;
        if (res.rankingProductos && res.rankingProductos.length > 0) {
          this.productoEstrella = res.rankingProductos[0].nombre;
        } else {
          this.productoEstrella = 'N/A';
        }
      },
      error: (err) => console.error('Error al cargar estadísticas:', err),
    });
  }

  cargarPedidosPendientes(id: string) {
    this.emprendedorService.getPedidosPendientes(id).subscribe({
      next: (res) => {
        this.pedidosPendientes = res;
      },
      error: (err) => console.error('Error al cargar pedidos:', err),
    });
  }

  obtenerProductos(emprendedorId: string) {
    this.productoService.getProductosPorEmprendedor(emprendedorId).subscribe({
      next: (res) => {
        this.productos = res;
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      },
    });
  }

  mostrarFormularioAgregar() {
    this.mostrarFormulario = true;
    this.editando = false;
    this.productoEditandoId = null;
    this.nuevoProducto = {
      nombre: '',
      precio: null,
      descripcion: '',
      cantidad: 0,
      imagen: '',
      emprendedorId: this.emprendedorId,
    };
  }

  registrarProducto() {
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.precio) {
      this.alertService.error('Nombre y precio son requeridos!');
      return;
    }

    const emprendedorId = this.authService.getEmprendedorId();
    if (!emprendedorId) return;

    this.nuevoProducto.emprendedorId = emprendedorId;

    if (this.editando && this.productoEditandoId) {
      this.productoService
        .actualizarProducto(this.productoEditandoId, this.nuevoProducto)
        .subscribe({
          next: (res) => {
            const index = this.productos.findIndex(
              (p) => p._id === this.productoEditandoId,
            );
            if (index !== -1) {
              this.productos[index] = res;
            }
            this.alertService.success('Producto actualizado correctamente');
            this.cancelarFormulario();
          },
          error: (err) => {
            console.error('Error al actualizar:', err);
            this.alertService.error(
              'Error',
              'No se pudo actualizar el producto',
            );
          },
        });
    } else {
      this.productoService.agregarProducto(this.nuevoProducto).subscribe({
        next: (res) => {
          this.productos.push(res);
          this.alertService.success('Producto creado con éxito');
          this.cancelarFormulario();
        },
        error: (err) => {
          console.error('Error al agregar:', err);
          this.alertService.error('Error', 'No se pudo registrar el producto');
        },
      });
    }
  }

  editarProducto(producto: any) {
    this.mostrarFormulario = true;
    this.editando = true;
    this.productoEditandoId = producto._id;
    this.nuevoProducto = {
      ...producto,
      emprendedorId: this.emprendedorId,
    };

    setTimeout(() => {
      if (this.formularioProducto) {
        this.formularioProducto.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }

  eliminarProducto(id: string) {
    this.alertService
      .confirm('¿Estás seguro?', 'Esta acción eliminará el producto')
      .then((confirmed) => {
        if (confirmed) {
          this.productoService.eliminarProducto(id).subscribe({
            next: () => {
              this.productos = this.productos.filter((p) => p._id !== id);
              this.alertService.success('Producto eliminado correctamente');
            },
            error: (err) => {
              console.error(err);
              this.alertService.error(
                'Error',
                'No se pudo eliminar el producto',
              );
            },
          });
        }
      });
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.editando = false;
    this.productoEditandoId = null;
    this.nuevoProducto = {
      nombre: '',
      precio: null,
      descripcion: '',
      cantidad: 0,
      imagen: '',
      emprendedorId: this.emprendedorId,
    };
  }

  productosBajosStock() {
    return this.productos.filter((p) => p.cantidad < 5);
  }

  getBadgeClass(cantidad: number) {
    if (cantidad <= 0) return 'low-stock';
    if (cantidad < 10) return 'medium-stock';
    return 'high-stock';
  }
}
