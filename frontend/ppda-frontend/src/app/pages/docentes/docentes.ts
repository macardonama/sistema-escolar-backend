import {

  Component,

  inject,

  OnInit,

  ChangeDetectorRef

} from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { HeaderComponent } from '../../shared/header/header';

import { FormsModule } from '@angular/forms';

import { UsuariosService } from '../../core/services/usuarios';
import { DocentesService } from '../../core/services/docentes';
import { GruposService } from '../../core/services/grupos';

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './docentes.html',
  styleUrl: './docentes.css'
})
export class DocentesComponent {

  mostrarSidebar = true;

  private usuariosService =
  inject(UsuariosService);

  private docentesService =
    inject(DocentesService);
    private cdr =
    inject(ChangeDetectorRef);

  private gruposService =
  inject(GruposService);

  usuario: any = {};

  usuariosDocentes: any[] = [];

  docentes: any[] = [];

  grupos: any[] = [];

  mostrarModal = false;

  modoEdicion = false;

  docenteEditandoId: number | null = null;

  usuarioId: number | null = null;

  nombreUsuarioEditando = '';

  documento = '';
  telefono = '';

  docentesFiltrados: any[] = [];

  filtroTextoDocente = '';

filtroEstadoDocente = 'TODOS';

  erroresDocente = {
  usuarioId: '',
  documento: '',
  telefono: ''
};

filtroGrupoDirigido = 'TODOS';

mensajeErrorDocente = '';

  toggleSidebar() {

    this.mostrarSidebar =
      !this.mostrarSidebar;
  }

ngOnInit(): void {

  const usuarioGuardado =
    localStorage.getItem('usuario');

  if (usuarioGuardado) {

    this.usuario =
      JSON.parse(usuarioGuardado);
  }

  this.cargarDocentes();

  this.cargarGrupos();
}


cargarDocentes() {

  this.docentesService

    .listarDocentes()

    .subscribe({

      next: (response: any) => {

        console.log(response);

        this.docentes =
          response.docentes;

        this.aplicarFiltrosDocentes();

        this.cargarUsuariosDocentesDisponibles();
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

aplicarFiltrosDocentes() {

  this.docentesFiltrados =
    this.docentes.filter((docente: any) => {

      const gruposDirigidos =
      this.grupos.filter(
        grupo =>
          grupo.directorDocenteId === docente.id
      );

    const coincideGrupo =
      this.filtroGrupoDirigido === 'TODOS' ||
      (
        this.filtroGrupoDirigido === 'SIN_GRUPO' &&
        gruposDirigidos.length === 0
      ) ||
      gruposDirigidos.some(
        grupo =>
          Number(grupo.id) === Number(this.filtroGrupoDirigido)
      );

      const texto =
        this.filtroTextoDocente.toLowerCase();

          const coincideTexto =
        !texto ||
        docente.usuario?.nombre
          ?.toLowerCase()
          .includes(texto) ||
        docente.usuario?.correo
          ?.toLowerCase()
          .includes(texto) ||
        docente.documento
          ?.toString()
          .toLowerCase()
          .includes(texto) ||
        docente.telefono
          ?.toString()
          .toLowerCase()
          .includes(texto);

      const activoDocente =
        docente.usuario?.activo ?? docente.activo;

      const coincideEstado =
        this.filtroEstadoDocente === 'TODOS' ||
        (
          this.filtroEstadoDocente === 'ACTIVO' &&
          activoDocente
        ) ||
        (
          this.filtroEstadoDocente === 'INACTIVO' &&
          !activoDocente
        );

      return (
      coincideTexto &&
      coincideEstado &&
      coincideGrupo
    );
    });

  this.cdr.detectChanges();
}

limpiarFiltrosDocentes() {

  this.filtroTextoDocente = '';

  this.filtroEstadoDocente = 'TODOS';

  this.filtroGrupoDirigido = 'TODOS';

  this.aplicarFiltrosDocentes();
}

cargarUsuariosDocentesDisponibles() {

  this.usuariosService

    .listarUsuarios()

    .subscribe({

      next: (response: any) => {

        const idsUsuariosConDocente =
          this.docentes.map(
            docente => docente.usuarioId
          );

        this.usuariosDocentes =
          response.usuarios.filter(
            (usuario: any) =>
              usuario.rol === 'DOCENTE' &&
              !idsUsuariosConDocente.includes(usuario.id)
          );

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

cargarGrupos() {

  this.gruposService

    .listarGrupos()

    .subscribe({

      next: (response: any) => {

        this.grupos =
          response.grupos;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

crearDocente() {

  if (!this.validarFormularioDocente()) {

    this.cdr.detectChanges();

  return;
}

  this.docentesService

    .crearDocente(
      Number(this.usuarioId),
      this.documento,
      this.telefono
    )

    .subscribe({

      next: (response: any) => {

        console.log(response);

        this.cargarDocentes();

        this.mostrarModal = false;
      },

      error: (error) => {

        this.mensajeErrorDocente =
          error.error?.mensaje ||
          'No fue posible crear el docente. Verifica la información e intenta nuevamente.';

        this.cdr.detectChanges();
      }
    });
}

editarDocente(docente: any) {

  this.modoEdicion = true;

  this.docenteEditandoId =
    docente.id;

  this.documento =
    docente.documento;

  this.telefono =
    docente.telefono;

  this.usuarioId =
    docente.usuarioId;

  this.mostrarModal = true;

  this.nombreUsuarioEditando =
  docente.usuario?.nombre || '';
}

actualizarDocente() {

  if (!this.validarFormularioDocente()) {

    this.cdr.detectChanges();

    return;
  }

  if (!this.docenteEditandoId) return;

  this.docentesService
    .actualizarDocente(
      this.docenteEditandoId,
      this.documento,
      this.telefono
    )
    .subscribe({

      next: () => {

        this.cerrarModalDocente();

        this.cargarDocentes();
      },

      error: (error) => {

        this.mensajeErrorDocente =
          error.error?.mensaje ||
          'No fue posible actualizar el docente. Verifica la información e intenta nuevamente.';

        this.cdr.detectChanges();
      }
    });
}

validarFormularioDocente(): boolean {

  this.erroresDocente = {
    usuarioId: '',
    documento: '',
    telefono: ''
  };

  this.mensajeErrorDocente = '';

  let formularioValido = true;

if (!this.modoEdicion && !this.usuarioId) {

  this.erroresDocente.usuarioId =
    'Debe seleccionar un usuario docente.';

  formularioValido = false;
}

  if (!this.documento.trim()) {

    this.erroresDocente.documento =
      'El documento es obligatorio.';

    formularioValido = false;
  }

  else if (!/^\d+$/.test(this.documento.trim())) {

  this.erroresDocente.documento =
    'El documento solo puede contener números.';

  formularioValido = false;
}

  if (!this.telefono.trim()) {

    this.erroresDocente.telefono =
      'El teléfono es obligatorio.';

    formularioValido = false;
  }

  else if (!/^\d+$/.test(this.telefono.trim())) {

  this.erroresDocente.telefono =
    'El teléfono solo puede contener números.';

  formularioValido = false;
}

const existeDocumento =
  this.docentes.some(
    docente =>
      docente.documento === this.documento.trim() &&
      docente.id !== this.docenteEditandoId
  );

if (existeDocumento) {

  this.erroresDocente.documento =
    'Ya existe un docente con este documento.';

  formularioValido = false;
}

const existeTelefono =
  this.docentes.some(
    docente =>
      docente.telefono === this.telefono.trim() &&
      docente.id !== this.docenteEditandoId
  );

if (existeTelefono) {

  this.erroresDocente.telefono =
    'Ya existe un docente con este teléfono.';

  formularioValido = false;
}

  return formularioValido;

}

soloNumeros(event: KeyboardEvent) {

  const tecla = event.key;

  if (!/[0-9]/.test(tecla)) {

    event.preventDefault();
  }
}

limpiarFormularioDocente() {

  this.usuarioId = null;

  this.documento = '';

  this.telefono = '';

  this.docenteEditandoId = null;

  this.modoEdicion = false;

  this.erroresDocente = {
    usuarioId: '',
    documento: '',
    telefono: ''
  };

  this.mensajeErrorDocente = '';
}

cerrarModalDocente() {

  this.limpiarFormularioDocente();

  this.mostrarModal = false;
}

abrirModalDocente() {

  this.limpiarFormularioDocente();

  this.mostrarModal = true;
}

}