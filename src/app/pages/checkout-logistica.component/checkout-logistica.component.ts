import { Component, OnInit } from '@angular/core';
import { DireccionService } from '../../services/direccion.service';
import { EnvioService } from '../../services/envio.service';
import { CarritoService } from '../../services/carritoCompras.service';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para el formulario

@Component({
  selector: 'app-checkout-logistica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-logistica.component.html',
  styleUrls: ['./checkout-logistica.component.css'],
})
export class CheckoutLogisticaComponent implements OnInit {
  clienteId: string = localStorage.getItem('clienteId') || '';
  direcciones: any[] = [];
  puntosRecogida: any[] = [];
  carrito: any = null;

  tipoEnvio: 'domicilio' | 'punto_recogida' = 'domicilio';
  seleccionId: string = '';
  costoEnvio: number = 12000;
  totalFinal: number = 0;

  // Lógica para nueva dirección
  mostrarForm: boolean = false;
  nuevaDireccion = {
    pais: 'Colombia',
    departamento: '',
    ciudad: '',
    barrio: '',
    direccion: '',
    descripcion: '',
    clienteId: this.clienteId
  };

  constructor(
    private direccionService: DireccionService,
    private envioService: EnvioService,
    private carritoService: CarritoService,
    private pedidoService: PedidoService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.carritoService.getCarrito(this.clienteId).subscribe((res) => {
      this.carrito = res;
      this.calcularTotal();
    });

    this.cargarDirecciones();

    this.envioService.getPuntosRecogida().subscribe((res) => {
      this.puntosRecogida = res;
    });
  }

  cargarDirecciones() {
    this.direccionService.getDirecciones(this.clienteId).subscribe((res) => {
      this.direcciones = res;
      if (res.length > 0 && !this.seleccionId && this.tipoEnvio === 'domicilio') {
        this.seleccionId = res[0]._id;
      }
    });
  }

  seleccionarOpcion(id: string, costo: number = 12000) {
    this.seleccionId = id;
    this.costoEnvio = (this.tipoEnvio === 'punto_recogida') ? costo : 12000;
    this.calcularTotal();
  }

  cambiarTipoEnvio(tipo: 'domicilio' | 'punto_recogida') {
    this.tipoEnvio = tipo;
    this.seleccionId = '';
    this.costoEnvio = (tipo === 'domicilio') ? 12000 : 0;
    this.mostrarForm = false; 
    this.calcularTotal();
  }

  calcularTotal() {
    if (this.carrito) {
      this.totalFinal = this.carrito.total + this.costoEnvio;
    }
  }

  abrirModalDireccion() {
    this.mostrarForm = !this.mostrarForm;
  }

  guardarDireccion() {
    this.direccionService.crearDireccion(this.nuevaDireccion).subscribe({
      next: (res) => {
        this.cargarDirecciones();
        this.mostrarForm = false;
        this.seleccionId = res._id; // Seleccionar la nueva automáticamente
        this.nuevaDireccion = { // Resetear form
          pais: 'Colombia', departamento: '', ciudad: '', barrio: '', 
          direccion: '', descripcion: '', clienteId: this.clienteId 
        };
      },
      error: (err) => alert("Error al guardar la dirección")
    });
  }

  confirmarYIrAPago() {
    if (!this.seleccionId) {
      alert('Por favor selecciona una opción de entrega');
      return;
    }

    const datosEnvio = {
      clienteId: this.clienteId,
      tipo: this.tipoEnvio,
      direccionId: this.tipoEnvio === 'domicilio' ? this.seleccionId : null,
      puntoRecogidaId: this.tipoEnvio === 'punto_recogida' ? this.seleccionId : null,
      costo: this.costoEnvio,
    };

    this.envioService.crearRegistroEnvio(datosEnvio).subscribe((envio) => {
      this.pedidoService.crearOrden(this.clienteId, envio._id, this.costoEnvio).subscribe((ordenRes) => {
        const usuario = this.authService.getUsuarioActual();
        this.pedidoService.configurarYAbrirCheckout(ordenRes.orden, usuario);
      });
    });
  }

  irAlCarrito() { this.router.navigate(['carrito']); }
}