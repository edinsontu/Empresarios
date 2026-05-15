import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  success(title: string, text?: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text || '',
      confirmButtonColor: '#28a745'
    });
  }

  error(title: string, text?: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text || '',
      confirmButtonColor: '#dc3545'
    });
  }

  confirm(title: string, text: string): Promise<boolean> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => result.isConfirmed);
  }

  info(title: string, text?: string) {
    Swal.fire({
      icon: 'info',
      title: title,
      text: text || '',
      confirmButtonColor: '#17a2b8'
    });
  }
}
