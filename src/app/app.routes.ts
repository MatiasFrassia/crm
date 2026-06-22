import { Routes } from '@angular/router';
import { NuevaOportunidad } from './componentes/nueva-oportunidad/nueva-oportunidad';
import { NotFound } from './componentes/not-found/not-found';
import { Lista } from './componentes/lista/lista';
import { LoginComponent } from './componentes/login-component/login-component';
import { AdministrarUsuariosComponent } from './componentes/administrar-usuarios/administrar-usuarios';

export const routes: Routes = [
    {path: 'nueva-oportunidad', component: NuevaOportunidad},
    {path: 'lista', component: Lista},
    {path: 'login', component: LoginComponent},
    {path: 'administrar-usuarios', component: AdministrarUsuariosComponent},
    {path:'', component: NotFound}
];
