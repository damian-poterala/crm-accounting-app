import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsModule                                           } from 'primeng/tabs';
import { ButtonModule                                         } from 'primeng/button';
import { TagModule                                            } from 'primeng/tag';
import { DialogService, DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog';

import { ClientDetailsFormDialog } from '../../clients/dialogs/client-details-form-dialog/client-details-form-dialog';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    CommonModule,

    TabsModule,
    ButtonModule,
    TagModule,
  ],
  templateUrl: './client-details.html',
  styleUrl: './client-details.scss',
})
export class ClientDetails {
  private readonly dialogService  = inject(DialogService);

  private dialogRef ?: DynamicDialogRef | null = null;

  openClientDetailsFormDialog() {
    this.dialogRef = this.dialogService.open(ClientDetailsFormDialog, {
      header      : 'Uzupełnij dane klienta',
      width       : '1000px',
      modal       : true,
      closable    : false,
      maximizable : false,
      draggable   : false,
    });

    this.dialogRef?.onClose.subscribe((result: any) => {
      if(!result) {
        return;
      }
    });
  }
}
