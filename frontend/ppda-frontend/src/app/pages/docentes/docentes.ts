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

  usuariosDocentes: any[] = [];

  docentes: any[] = [];

  mostrarModal = false;

  usuarioId: number | null = null;

  documento = '';
  telefono = '';

  toggleSidebar() {

    this.mostrarSidebar =
      !this.mostrarSidebar;
  }

  ngOnInit(): void {

  this.usuariosService

    .listarUsuarios()

    .subscribe({

      next: (response: any) => {

        this.usuariosDocentes =

          response.usuarios.filter(

            (usuario: any) =>
              usuario.rol === 'DOCENTE'
          );
      },

      error: (error) => {

        console.error(error);
      }
    });

    this.cargarDocentes();
}


cargarDocentes() {

  this.docentesService

    .listarDocentes()

    .subscribe({

      next: (response: any) => {

        console.log(response);

        this.docentes =
          response.docentes;
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

crearDocente() {

  if (!this.usuarioId) return;

  this.docentesService

    .crearDocente(
      this.usuarioId,
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

        console.error(error);
      }
    });
}
}