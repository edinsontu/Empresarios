import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent} from "./pages/register/register.component";
import { RegisterClienteComponent } from './auth/register/cliente/cliente.component';
import { RegisterEmprendedorComponent} from './auth/register/emprendedor/emprendedor.component';
import { LoginComponent } from './auth/login/login.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { EmprendedorComponent } from './pages/emprendedor/emprendedor.component';
import { HomeComponent } from './pages/home/home.component';
import { CarritoComponent } from './pages/carritoCompras/carritoCompras.component';
import { AuthGuard } from './guards/auth.guard';
import { ClienteGuard } from './guards/cliente.guard';
import { EmprendedorGuard } from './guards/emprendedor.guard';
import { PagoFinalizadoComponent } from './pages/pago-finalizado/pago-finalizado.component';
import { NgModule } from '@angular/core';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/cliente', component: RegisterClienteComponent },
  { path: 'register/emprendedor', component: RegisterEmprendedorComponent },
  { path: 'cliente/dashboard', component: ClienteComponent, canActivate: [AuthGuard, ClienteGuard] },
  { path: 'carrito', component: CarritoComponent, canActivate: [AuthGuard, ClienteGuard] },
  { path: 'pago-finalizado', component: PagoFinalizadoComponent },
  { path: 'emprendedor/dashboard', component: EmprendedorComponent, canActivate: [AuthGuard, EmprendedorGuard]},
  { path: '', redirectTo: 'login', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
