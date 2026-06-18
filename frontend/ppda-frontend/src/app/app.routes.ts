import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { UsuariosComponent } from './pages/usuarios/usuarios';
import { GruposComponent } from './pages/grupos/grupos';
import { DocentesComponent } from './pages/docentes/docentes';
import { EstudiantesComponent } from './pages/estudiantes/estudiantes';
import { AcudientesComponent } from './pages/acudientes/acudientes';
import { roleGuard } from './guards/role.guard';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil';
import { MisAcudidosComponent } from './pages/mis-acudidos/mis-acudidos';
import { AreasComponent } from './pages/areas/areas';

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
  component: UsuariosComponent,
  canActivate: [roleGuard],
  data: {
    roles: ['ADMINISTRATIVO']
  }
},

{
  path: 'grupos',
  component: GruposComponent,
  canActivate: [roleGuard],
  data: {
    roles: ['ADMINISTRATIVO', 'DOCENTE']
  }
},

 {
  path: 'docentes',
  component: DocentesComponent,
  canActivate: [roleGuard],
  data: {
    roles: ['ADMINISTRATIVO', 'DOCENTE']
  }
},

{
  path: 'estudiantes',
  component: EstudiantesComponent,
  canActivate: [roleGuard],
  data: {
    roles: ['ADMINISTRATIVO', 'DOCENTE']
  }
},

{
  path: 'acudientes',
  component: AcudientesComponent,
  canActivate: [roleGuard],
  data: {
    roles: ['ADMINISTRATIVO', 'DOCENTE']
  }
},

{
  path: 'mi-perfil',
  component: MiPerfilComponent,
  canActivate: [roleGuard],
  data: {
    roles: ['ESTUDIANTE']
  }
},

{
  path: 'mis-acudidos',
  component: MisAcudidosComponent,
  canActivate: [roleGuard],
  data: {
    roles: ['ACUDIENTE']
  }
},

{
  path: 'areas',
  component: AreasComponent,
  canActivate: [roleGuard],
  data: {
    roles: ['ADMINISTRATIVO']
  }
},
];