import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { HeaderComponent } from '../../shared/header/header';

import { AreasService } from '../../core/services/areas';

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './areas.html',
  styleUrl: './areas.css'
})
export class AreasComponent implements OnInit {

  private areasService = inject(AreasService);
  private cdr = inject(ChangeDetectorRef);

  areas: any[] = [];

  mostrarModal = false;

  nombre = '';
  descripcion = '';

  modoEdicion = false;

  areaEditandoId: number | null = null;

  activo = true;

  filtroEstado = 'TODOS';

  erroresArea = {
    nombre: '',
    descripcion: ''
  };

  ngOnInit(): void {

    this.cargarAreas();
  }

  cargarAreas() {

    this.areasService
      .listarAreas()
      .subscribe({
        next: (response: any) => {

          this.areas =
            response.areas;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(error);
        }
      });
  }

abrirModal() {

  this.modoEdicion = false;

  this.areaEditandoId = null;

  this.activo = true;

  this.mostrarModal = true;

  this.nombre = '';

  this.descripcion = '';

  this.erroresArea = {
    nombre: '',
    descripcion: ''
  };
}

  cerrarModal() {

    this.mostrarModal = false;

    this.nombre = '';
    this.descripcion = '';

    this.erroresArea = {
      nombre: '',
      descripcion: ''
    };
  }

crearArea() {

  this.erroresArea = {
    nombre: '',
    descripcion: ''
  };

  let hayErrores = false;

  if (!this.nombre.trim()) {

    this.erroresArea.nombre =
      'Debe ingresar el nombre del área';

    hayErrores = true;
  }

  if (!this.descripcion.trim()) {

    this.erroresArea.descripcion =
      'Debe ingresar la descripción del área';

    hayErrores = true;
  }

  const nombreExiste =
    this.areas.some(
      area =>
        area.nombre.toLowerCase() ===
        this.nombre.trim().toLowerCase()
    );

  if (nombreExiste) {

    this.erroresArea.nombre =
      'Ya existe un área con este nombre';

    hayErrores = true;
  }

  if (hayErrores) {
    return;
  }

  this.areasService
    .crearArea(
      this.nombre,
      this.descripcion
    )
    .subscribe({
      next: () => {

        this.cargarAreas();

        this.cerrarModal();
      },

      error: (error) => {

        this.erroresArea.nombre =
          error.error?.mensaje || 'No se pudo crear el área';

        this.cdr.detectChanges();
      }
    });
}

  abrirModalEditar(area: any) {

  this.modoEdicion = true;

  this.areaEditandoId = area.id;

  this.nombre = area.nombre;

  this.descripcion = area.descripcion;

  this.activo = area.activo;

  this.erroresArea = {
    nombre: '',
    descripcion: ''
  };

  this.mostrarModal = true;
}

actualizarArea() {

  this.erroresArea = {
    nombre: '',
    descripcion: ''
  };

this.erroresArea = {
  nombre: '',
  descripcion: ''
};

let hayErrores = false;

if (!this.nombre.trim()) {

  this.erroresArea.nombre =
    'Debe ingresar el nombre del área';

  hayErrores = true;
}

if (!this.descripcion.trim()) {

  this.erroresArea.descripcion =
    'Debe ingresar la descripción del área';

  hayErrores = true;
}

if (hayErrores) {
  return;
}

  const nombreExiste =
    this.areas.some(
      area =>
        area.nombre.toLowerCase() === this.nombre.trim().toLowerCase() &&
        area.id !== this.areaEditandoId
    );

  if (nombreExiste) {

    this.erroresArea.nombre =
      'Ya existe un área con este nombre';

    return;
  }

  if (!this.areaEditandoId) return;

  this.areasService
    .actualizarArea(
      this.areaEditandoId,
      this.nombre,
      this.descripcion,
      this.activo
    )
    .subscribe({
      next: () => {

        this.cargarAreas();

        this.cerrarModal();
      },

      error: (error) => {
        console.error(error);
      }
    });
}
}
