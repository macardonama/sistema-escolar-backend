import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../core/services/usuarios';
import { HeaderComponent } from '../../shared/header/header';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class UsuariosComponent implements OnInit {

  private usuariosService = inject(UsuariosService);
  private cdr = inject(ChangeDetectorRef);

  usuarios: any[] = [];

  usuariosFiltrados: any[] = [];

  filtroRol = 'TODOS';

  mostrarSidebar = true;

  mostrarModal = false;

  nombre = '';
  correo = '';
  password = '';
  rol = '';

  mensajeError = '';

errores = {
  nombre: '',
  correo: '',
  password: '',
  rol: ''
};

  modoEdicion = false;

  usuarioEditandoId: number | null = null;

toggleSidebar() {

    this.mostrarSidebar =
    !this.mostrarSidebar;
}

filtrarUsuarios() {

  if (this.filtroRol === 'TODOS') {

    this.usuariosFiltrados =
      this.usuarios;

    return;
  }

  this.usuariosFiltrados =
    this.usuarios.filter(

      usuario =>
        usuario.rol === this.filtroRol
    );
}

abrirModal() {

  this.modoEdicion = false;

  this.usuarioEditandoId = null;

  this.nombre = '';
  this.correo = '';
  this.password = '';
  this.rol = '';

  this.mensajeError = '';

  this.errores = {
    nombre: '',
    correo: '',
    password: '',
    rol: ''
  };

  this.mostrarModal = true;
}

cerrarModal() {

  this.mostrarModal = false;

  this.modoEdicion = false;

  this.usuarioEditandoId = null;

  this.nombre = '';
  this.correo = '';
  this.password = '';
  this.rol = '';

  this.mensajeError = '';

  this.errores = {
    nombre: '',
    correo: '',
    password: '',
    rol: ''
  };
}

editarUsuario(usuario: any) {

  this.modoEdicion = true;

  this.usuarioEditandoId = usuario.id;

  this.nombre = usuario.nombre;
  this.correo = usuario.correo;
  this.rol = usuario.rol;

  this.password = '';

  this.mostrarModal = true;
}
validarFormularioCrearUsuario(): boolean {

  this.errores = {
    nombre: '',
    correo: '',
    password: '',
    rol: ''
  };

  let formularioValido = true;

  if (!this.nombre.trim()) {
    this.errores.nombre = 'El nombre es obligatorio.';
    formularioValido = false;
  }

if (!this.correo.trim()) {

  this.errores.correo =
    'El correo es obligatorio.';

  formularioValido = false;

} else {

  const correoValido =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!correoValido.test(this.correo)) {

    this.errores.correo =
      'Debe ingresar un correo válido.';

    formularioValido = false;
  }
}

  if (!this.password.trim()) {
    this.errores.password = 'La contraseña es obligatoria.';
    formularioValido = false;
  }

  if (!this.rol) {
    this.errores.rol = 'Debe seleccionar un rol.';
    formularioValido = false;
  }

  return formularioValido;
}
crearUsuario() {

  this.mensajeError = '';

  if (!this.validarFormularioCrearUsuario()) {
    return;
  }

  console.log('CLICK CREAR');

  this.usuariosService

  console.log('CLICK CREAR');

  this.usuariosService

    .crearUsuario(
      this.nombre,
      this.correo,
      this.password,
      this.rol
    )

    .subscribe({

      next: () => {

        this.mostrarModal = false;

        this.ngOnInit();

      },

    error: (error) => {

  console.error(error);

  this.mensajeError =
    error.error?.mensaje ||
    'No fue posible crear el usuario. Verifica la información ingresada.';

  this.cdr.detectChanges();
}
    });
}
validarFormularioActualizarUsuario(): boolean {

  this.errores = {
    nombre: '',
    correo: '',
    password: '',
    rol: ''
  };

  let formularioValido = true;

  if (!this.nombre.trim()) {

    this.errores.nombre =
      'El nombre es obligatorio.';

    formularioValido = false;
  }

  if (!this.correo.trim()) {

    this.errores.correo =
      'El correo es obligatorio.';

    formularioValido = false;

  } else {

    const correoValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoValido.test(this.correo)) {

      this.errores.correo =
        'Debe ingresar un correo válido.';

      formularioValido = false;
    }
  }

  if (!this.rol) {

    this.errores.rol =
      'Debe seleccionar un rol.';

    formularioValido = false;
  }

  return formularioValido;
}

actualizarUsuario() {

  this.mensajeError = '';

  if (!this.validarFormularioActualizarUsuario()) {

    return;

  }

  if (!this.usuarioEditandoId) return;

  this.usuariosService

  if (!this.usuarioEditandoId) return;

  this.usuariosService

    .actualizarUsuario(
      this.usuarioEditandoId,
      this.nombre,
      this.correo,
      this.rol
    )

    .subscribe({

      next: () => {

        this.mostrarModal = false;

        this.modoEdicion = false;

        this.cargarUsuarios();

        this.ngOnInit();
      },

    error: (error) => {

  console.error(error);

  this.mensajeError =
    error.error?.mensaje ||
    error.error?.message ||
    'No fue posible actualizar el usuario. Verifica la información ingresada.';

  this.cdr.detectChanges();
}
    });
}

desactivarUsuario(id: number) {

  this.usuariosService

    .desactivarUsuario(id)

    .subscribe({

      next: () => {

        this.cargarUsuarios();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

activarUsuario(id: number) {

  this.usuariosService

    .activarUsuario(id)

    .subscribe({

      next: () => {

        this.cargarUsuarios();
      },

      error: (error) => {

        console.error(error);
      }
    });
}
  ngOnInit(): void {
  this.cargarUsuarios();
  }

    cargarUsuarios() {

  this.usuariosService

    .listarUsuarios()

    .subscribe({

      next: (response: any) => {

        console.log(response);

        this.usuarios =
          response.usuarios;

        this.usuariosFiltrados =
          response.usuarios;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);
      }
    });
}
}