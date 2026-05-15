import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-dashboard-emprendedor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emprendedor.component.html',
  styleUrls: ['./emprendedor.component.css']
})
export class EmprendedorComponent implements OnInit {
  productos: any[] = [];
  mostrarFormulario = false;
  editando = false;
  productoEditandoId: string | null = null;
  emprendedorId: string = '';

  nuevoProducto = {
    nombre: '',
    precio: null,
    descripcion: '',
    imagen: '',          // <-- propiedad para URL imagen
    emprendedorId: ''
  };

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    const emprendedorId = this.authService.getEmprendedorId();
    if (emprendedorId) {
      this.emprendedorId = emprendedorId;
      this.obtenerProductos(emprendedorId);
    } else {
      console.error('No se encontró emprendedorId en localStorage');
    }
  }

  obtenerProductos(emprendedorId: string) {
    this.productoService.getProductosPorEmprendedor(emprendedorId).subscribe({
      next: (res) => {
        this.productos = res;
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      }
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
      imagen: '',           // limpiar campo imagen
      emprendedorId: this.emprendedorId
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
      this.productoService.actualizarProducto(
        this.productoEditandoId,
        this.nuevoProducto
      ).subscribe({
        next: (res) => {
          const index = this.productos.findIndex(p => p._id === this.productoEditandoId);
          if (index !== -1) {
            this.productos[index] = res;
          }
          this.alertService.success('Producto actualizado correctamente');
          this.cancelarFormulario();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.alertService.error('Error', 'No se pudo actualizar el producto');
        }
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
        }
      });
    }
  }

  editarProducto(producto: any) {
    this.mostrarFormulario = true;
    this.editando = true;
    this.productoEditandoId = producto._id;
    this.nuevoProducto = {
      ...producto,
      emprendedorId: this.emprendedorId
    };
  }

  eliminarProducto(id: string) {
    this.alertService.confirm('¿Estás seguro?', 'Esta acción eliminará el producto').then((confirmed) => {
      if (confirmed) {
        this.productoService.eliminarProducto(id).subscribe({
          next: () => {
            this.productos = this.productos.filter(p => p._id !== id);
            this.alertService.success('Producto eliminado correctamente');
          },
          error: (err) => {
            console.error(err);
            this.alertService.error('Error', 'No se pudo eliminar el producto');
          }
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
      imagen: '',
      emprendedorId: this.emprendedorId
    };
  }
}
