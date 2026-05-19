import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { HeaderComponent } from '../../shared/header/header';

import { inject, OnInit } from '@angular/core';
import { GruposService } from '../../core/services/grupos';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './grupos.html',
  styleUrl: './grupos.css'
})
export class GruposComponent implements OnInit {

  mostrarSidebar = true;

  private gruposService =
  inject(GruposService);

  grupos: any[] = [];

  toggleSidebar() {

    this.mostrarSidebar =
      !this.mostrarSidebar;
  }

  ngOnInit(): void {

  this.gruposService

    .listarGrupos()

    .subscribe({

      next: (response: any) => {

        console.log(response);

        this.grupos =
          response.grupos;
      },

      error: (error) => {

        console.error(error);
      }
    });
}
}
