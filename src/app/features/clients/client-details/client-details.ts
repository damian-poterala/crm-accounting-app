import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { TabsModule                                           } from 'primeng/tabs';
import { ButtonModule                                         } from 'primeng/button';
import { TagModule                                            } from 'primeng/tag';
import { DialogService, DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog';

import { ClientService } from '../../../core/services/client.service';

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
  private readonly clientService = inject(ClientService);

  private  route = inject(ActivatedRoute);

  clientId = this.route.snapshot.paramMap.get('id');

  details = signal<any>({});

  private dialogRef ?: DynamicDialogRef | null = null;

  ngOnInit() {
    this.clientService.getDetails(this.clientId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.details.set(response);
        console.log(this.details());
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  openClientDetailsFormDialog() {
    this.dialogRef = this.dialogService.open(ClientDetailsFormDialog, {
      header      : 'Uzupełnij dane klienta',
      width       : '1000px',
      modal       : true,
      closable    : false,
      maximizable : false,
      draggable   : false,
      data: {
        clientId: this.clientId,
      }
    });

    this.dialogRef?.onClose.subscribe((result: any) => {
      if(!result) {
        return;
      }
    });
  }
}
