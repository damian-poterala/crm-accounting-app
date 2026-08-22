import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-files-view',
  standalone: true,
  imports: [
    CommonModule,

    ButtonModule
  ],
  templateUrl: './files-view.html',
  styleUrl: './files-view.scss',
})
export class FilesView {
  files = [
    {
        id: 1,
        name: 'Lista klientów',
        icon: 'pi-file'
    },
    {
        id: 2,
        name: 'Deklaracje',
        icon: 'pi-file'
    },
    {
        id: 3,
        name: 'Faktury',
        icon: 'pi-file'
    },
    {
        id: 4,
        name: 'Cennik usług',
        icon: 'pi-file'
    }
  ];
}
