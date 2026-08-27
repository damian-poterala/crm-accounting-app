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
        name: 'UPL 1',
        icon: 'pi-file'
    },
    {
        id: 2,
        name: 'PEL',
        icon: 'pi-file'
    },
    {
        id: 3,
        name: 'VAT-R',
        icon: 'pi-file'
    },
    {
        id: 4,
        name: 'PCC',
        icon: 'pi-file'
    }
  ];
}
