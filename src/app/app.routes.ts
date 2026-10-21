import { Routes } from '@angular/router';
import { NuevaOportunidad } from './componentes/nueva-oportunidad/nueva-oportunidad';
import { NotFound } from './componentes/not-found/not-found';
import { Lista } from './componentes/lista/lista';
import { LoginComponent } from './componentes/login-component/login-component';
import { AdministrarUsuariosComponent } from './componentes/administrar-usuarios/administrar-usuarios';
import { guardGuard } from './utils/guard-guard'; // 👈 Cambiado a adminGuard

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'lista', component: Lista },
  { path: 'nueva-oportunidad', component: NuevaOportunidad },
  { 
    path: 'administrar-usuarios', 
    component: AdministrarUsuariosComponent, 
    canActivate: [guardGuard] // 👈 Usamos guardGuard
  },
  { path: '**', component: NotFound }
];
