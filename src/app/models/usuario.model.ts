export interface Usuario {
    id: number;
    email: string;
    password: string;
    tipo: 'cliente' | 'emprendedor';
    nameEmprendimiento?: string; // Solo para emprendedores
  }