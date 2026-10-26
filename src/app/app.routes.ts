import { Routes } from '@angular/router';
import { NuevaOportunidad } from './componentes/nueva-oportunidad/nueva-oportunidad';
import { NotFound } from './componentes/not-found/not-found';
import { Lista } from './componentes/lista/lista';
import { LoginComponent } from './componentes/login-component/login-component';
import { AdministrarUsuariosComponent } from './componentes/administrar-usuarios/administrar-usuarios';
// 👈 Importamos ambos guards desde tu archivo
import { authGuard, adminGuard } from './utils/guard-guard'; 
import { DashboardComponent } from './componentes/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // 🔒 RUTAS GENERALES PROTEGIDAS (Requieren estar logueado)
  { path: 'lista', component: Lista, canActivate: [authGuard] },
  { path: 'nueva-oportunidad', component: NuevaOportunidad, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'portal-cliente', loadComponent: () => import('./componentes/portal-cliente/portal-cliente').then(m => m.PortalCliente), canActivate: [authGuard] },
  { path: 'mi-perfil', loadComponent: () => import('./componentes/perfil-cliente/perfil-cliente').then(m => m.PerfilClienteComponent), canActivate: [authGuard] },
  { path: 'carteraClientes', loadComponent: () => import('./componentes/cartera-clientes/cartera-clientes').then(m => m.CarteraClientesComponent), canActivate: [authGuard] },
  { path: 'historial', loadComponent: () => import('./componentes/historial-oportunidades/historial-oportunidades').then(m => m.HistorialComponent), canActivate: [authGuard] },
  // 🔒 RUTA ESTRICTA (Requiere ser Administrador)
  {
    path: 'administrar-usuarios',
    component: AdministrarUsuariosComponent,
    canActivate: [adminGuard]
  },
  
  { path: '**', component: NotFound }
];