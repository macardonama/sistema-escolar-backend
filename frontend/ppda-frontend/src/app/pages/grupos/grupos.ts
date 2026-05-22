import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { HeaderComponent } from '../../shared/header/header';

import { inject, OnInit } from '@angular/core';
import { GruposService } from '../../core/services/grupos';

import { FormsModule } from '@angular/forms';

import { DocentesService } from '../../core/services/docentes';


@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    FormsModule,
    HeaderComponent
  ],
  templateUrl: './grupos.html',
  styleUrl: './grupos.css'
})
export class GruposComponent implements OnInit {

  mostrarSidebar = true;

  private gruposService =
  inject(GruposService);
  private cdr =
  inject(ChangeDetectorRef);

  grupos: any[] = [];

  private docentesService =
  inject(DocentesService);

  docentes: any[] = [];

  mostrarModal = false;

  nombre = '';

  grado = '';

  directorId: number | null = null;

  toggleSidebar() {

    this.mostrarSidebar =
      !this.mostrarSidebar;
  }

  ngOnInit(): void {

    this.docentesService

  .listarDocentes()

  .subscribe({

    next: (response: any) => {

      console.log(response);

      this.docentes =
        response.docentes;
    },

    error: (error) => {

      console.error(error);
    }
  });

  this.gruposService

    this.cargarGrupos();
}

cargarGrupos() {

  this.gruposService

    .listarGrupos()

    .subscribe({

      next: (response: any) => {

        console.log(response);

        this.grupos =
          response.grupos;
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

crearGrupo() {

  if (!this.directorId) return;

  this.gruposService

    .crearGrupo(
      this.nombre,
      this.grado,
      this.directorId
    )

    .subscribe({

      next: (response: any) => {

        console.log(response);

        this.mostrarModal = false;

        this.cdr.detectChanges();

        this.gruposService

          this.cargarGrupos();
      },

      error: (error) => {

        console.error(error);
      }
    });
}
}
