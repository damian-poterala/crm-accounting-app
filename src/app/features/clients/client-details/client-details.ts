import { Component, inject, signal } from '@angular/core';
import { CommonModule              } from '@angular/common';
import { ActivatedRoute            } from '@angular/router';

import { TabsModule                      } from 'primeng/tabs';
import { ButtonModule                    } from 'primeng/button';
import { TagModule                       } from 'primeng/tag';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule                     } from 'primeng/table';
import { TooltipModule                   } from 'primeng/tooltip';
import { ToastModule                     } from 'primeng/toast';

import { ClientService   } from '../../../core/services/client.service';
import { ContactService  } from '../../../core/services/contact.service';
import { LocationService } from '../../../core/services/location.service';

import { MessageService } from 'primeng/api';

import { ClientDetailsFormDialog  } from '../../clients/dialogs/client-details-form-dialog/client-details-form-dialog';
import { ClientContactFormDialog  } from '../dialogs/client-contact-form-dialog/client-contact-form-dialog';
import { ClientLocationFormDialog } from '../dialogs/client-location-form-dialog/client-location-form-dialog';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    CommonModule,

    TabsModule,
    ButtonModule,
    TagModule,
    TableModule,
    TooltipModule,
    ToastModule,
  ],
  providers: [
    MessageService
  ],
  templateUrl: './client-details.html',
  styleUrl: './client-details.scss',
})
export class ClientDetails {
  private readonly dialogService   = inject(DialogService);
  private readonly clientService   = inject(ClientService);
  private readonly contactService  = inject(ContactService);
  private readonly locationService = inject(LocationService);
  private readonly messageService  = inject(MessageService);

  private  route = inject(ActivatedRoute);

  clientId = this.route.snapshot.paramMap.get('id');

  details   = signal<any>({});
  contacts  = signal<any>([]);
  locations = signal<any>([]);

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

    this.loadContacts();
    this.loadLocations();
  }

  private loadContacts(): void {
    this.contactService.getContactsPerClient(this.clientId).subscribe({
      next: (response) => {
        this.contacts.set(response);
        console.log('Contacts list: ', this.contacts());
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  private loadLocations(): void {
    this.locationService.getLocationsPerClient(this.clientId).subscribe({
      next: (response) => {
        this.locations.set(response);
        console.log('Locations list: ', this.locations());
      },
      error: (error) => {
        console.log(error);
      }
    });
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

  openClientContactFormDialog(type: string, data ?: any) {
    let contactObj = {};

    if(data) {
      contactObj = {
        id         : data.id,
        firstName  : data.first_name,
        lastName   : data?.last_name,
        positionId : data?.position_id,
        email      : data?.email,
        phone      : data?.phone
      }
    }

    this.dialogRef = this.dialogService.open(ClientContactFormDialog, {
      header      : 'Uzupełnij dane kontaktowe',
      width       : '500px',
      modal       : true,
      closable    : true,
      maximizable : false,
      draggable   : false,
      data: {
        clientId : this.clientId,
        data     : contactObj,
        type     : type
      }
    });

    this.dialogRef?.onClose.subscribe((result: any) => {
      if(!result) {
        return;
      }

      this.loadContacts();
    });
  }

  removeContact(id: number) {
    this.contactService.remove(id).subscribe({
      next: (response) => {
        this.messageService.add({ key: 'remove-contact', severity: 'success', summary: 'Komunikat', detail: response?.message });
        this.loadContacts();
      },
      error: (error) => {
        this.messageService.add({ key: 'remove-contact', severity: 'error', summary: 'Komunikat', detail: error?.message });
      }
    });
  }

  openClientLocationFormDialog(type: string, data ?: any) {
    let locationObj = {};

    if(data) {
      locationObj = {
        id              : data?.id,
        addressTypeId   : data?.address_type_id,
        street          : data?.street,
        buildingNumber  : data?.building_number,
        apartmentNumber : data?.apartment_number,
        postalCode      : data?.postal_code,
        city            : data?.city,
        country         : data?.country
      }
    }

    this.dialogRef = this.dialogService.open(ClientLocationFormDialog, {
      header      : 'Uzupełnij dane lokalizacji',
      width       : '500px',
      modal       : true,
      closable    : true,
      maximizable : false,
      draggable   : false,
      data: {
        clientId : this.clientId,
        data     : locationObj,
        type     : type
      }
    });

    this.dialogRef?.onClose.subscribe((result: any) => {
      if(!result) {
        return;
      }

      this.loadLocations();
    });
  }

  removeLocation(id: number) {
    this.locationService.remove(id).subscribe({
      next: (response: any) => {
        this.messageService.add({ key: 'remove-location', severity: 'success', summary: 'Komunikat', detail: response?.message });
        this.loadLocations();
      },
      error: (error) => {
        this.messageService.add({ key: 'remove-location', severity: 'error', summary: 'Komunikat', detail: error?.message });
      }
    });
  }

}
