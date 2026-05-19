import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { UsuariosComponent } from './pages/usuarios/usuarios';
import { GruposComponent } from './pages/grupos/grupos';
import { DocentesComponent } from './pages/docentes/docentes';
import { EstudiantesComponent } from './pages/estudiantes/estudiantes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'dashboard',
    component: DashboardComponent
  },

  {
  path: 'usuarios',
  component: UsuariosComponent
  },

  {
  path: 'grupos',
  component: GruposComponent
  },

  {
  path: 'docentes',
  component: DocentesComponent
  },

  {
  path: 'estudiantes',
  component: EstudiantesComponent
},
];