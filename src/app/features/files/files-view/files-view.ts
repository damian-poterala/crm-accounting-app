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
        original_name: 'UPL 1',
        icon: 'pi-file',
        created_at: '2026-08-10',
        uploaded_by: 'Damian Poterała'
    },
    {
        id: 2,
        original_name: 'PEL',
        icon: 'pi-file',
        created_at: '2026-07-01',
        uploaded_by: 'Damian Poterała'
    },
    {
        id: 3,
        original_name: 'VAT-R',
        icon: 'pi-file',
        created_at: '2026-06-23',
        uploaded_by: 'Damian Poterała',
    },
    {
        id: 4,
        original_name: 'PCC',
        icon: 'pi-file',
        created_at: '2026-06-23',
        uploaded_by: 'Damian Poterała'
    }
  ];
}
