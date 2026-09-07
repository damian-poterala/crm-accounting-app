import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { TabsModule                                           } from 'primeng/tabs';
import { ButtonModule                                         } from 'primeng/button';
import { TagModule                                            } from 'primeng/tag';
import { DialogService, DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';

import { ClientService } from '../../../core/services/client.service';
import { ContactService } from '../../../core/services/contact.service';

import { ClientDetailsFormDialog } from '../../clients/dialogs/client-details-form-dialog/client-details-form-dialog';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    CommonModule,

    TabsModule,
    ButtonModule,
    TagModule,
    TableModule,
  ],
  templateUrl: './client-details.html',
  styleUrl: './client-details.scss',
})
export class ClientDetails {
  private readonly dialogService  = inject(DialogService);
  private readonly clientService = inject(ClientService);
  private readonly contactService = inject(ContactService);

  private  route = inject(ActivatedRoute);

  clientId = this.route.snapshot.paramMap.get('id');

  details = signal<any>({});
  contacts = signal<any>([]);

  private dialogRef ?: DynamicDialogRef | null = null;

  ngOnInit() {
    this.clientService.getDetails(this.clientId).subscribe({
      next: (response: any) => {
        this.details.set(response);
        console.log('Details: ', this.details());
      },
      error: (error: any) => {
        console.log(error);
      }
    });

    this.contactService.getContactsPerClient(this.clientId).subscribe({
      next: (response) => {
        this.contacts.set(response);
        console.log('Contacts list: ', this.contacts());
      },
      error: (error) => {
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
