import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-pago-finalizado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago-finalizado.component.html',
  styleUrls: ['./pago-finalizado.component.css'],
})
export class PagoFinalizadoComponent implements OnInit {
  estadoPago: string = 'procesando';
  referencia: string | null = '';
  monto: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const ref_payco = params['ref_payco'];
      this.referencia = ref_payco; // <--- Asignamos para mostrar en el HTML

      if (ref_payco) {
        this.pedidoService
          .verificarYActualizarOrden(ref_payco)
          .subscribe((res) => {
            console.log('Respuesta del servidor:', res);

            // Actualizamos el estado basado en la respuesta real de la DB
            this.estadoPago =
              res.status === 'completada' ? 'aceptada' : 'pendiente';

            // Si el backend te devuelve el monto en el objeto orden:
            if (res.orden) {
              this.monto = res.orden.total;
            }
          });
      }
    });
  }

  irAInicio() {
    this.router.navigate(['cliente/dashboard']);
  }

  irAMisOrdenes() {
    this.router.navigate(['/perfil']);
  }
}
