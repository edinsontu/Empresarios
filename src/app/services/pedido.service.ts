import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../environments/environments';
import { Observable } from 'rxjs';

declare var ePayco: any; // Acceso al script global de ePayco

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private apiUrl = `${environments.API_BASE_URL}/`;

  constructor(private http: HttpClient) {}

  crearOrden(clienteId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}ordenes/crear`, { clienteId });
  }

  obtenerMisOrdenes(clienteId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}ordenes/cliente/${clienteId}`);
  }

  configurarYAbrirCheckout(orden: any, usuario: any) {
    console.log('Datos de la orden recibidos:', orden);
    const handler = ePayco.checkout.configure({
      key: environments.PUBLIC_KEY || '6b3b80b17fefab686f1661d170074036',
      test: true,
    });

    const data = {
      name: 'Compra en Microempresarios',
      description: `Orden #${orden.referenciaPago}`,
      invoice: orden.referenciaPago,
      currency: 'cop',
      amount: orden.total.toString(),
      tax_base: '0',
      tax: '0',
      country: 'co',
      lang: 'es',
      external: 'false',

      confirmation: `${environments.API_BASE_URL}/pagos/confirmar-epayco`,
      response: `${environments.API_BASE_URL}/pagos/redireccion-final`,

      name_billing: usuario.name,
      address_billing: 'Dirección registrada',
      mobile_billing: usuario.telefono || '3000000000',
      type_doc_billing: 'cc',
      number_doc_billing: '123456789',
    };

    handler.open(data);
  }

  verificarYActualizarOrden(referenciaPago: string): Observable<any> {
    return this.http.post(`${this.apiUrl}pagos/verificar-estado`, {
      ref_payco: referenciaPago,
    });
  }
}
