import { Component, inject, signal        } from '@angular/core';
import { DatePipe                         } from '@angular/common';
import { Router                           } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { 
  CompanyAutocomplete, 
  NipAutocomplete, 
  OwnerAutocomplete, 
  CompanyTypeSelect,
  CooperationStatus,
  Client 
} from '../../core/models';

import { removeEmptyProperties } from '../../core/utils/object.utils';

import { EditBasicClientDialog   } from '../clients/dialogs/edit-basic-client-dialog/edit-basic-client-dialog';
import { CreateBasicClientDialog } from '../clients/dialogs/create-basic-client-dialog/create-basic-client-dialog';

import { ClientService     } from '../../core/services/client.service';
import { DictionaryService } from '../../core/services/dictionary.service';
import { LoadingService    } from '../../core/services/loader.service';

import { MessageService } from 'primeng/api';

import { TableModule                                          } from 'primeng/table';
import { ToastModule                                          } from 'primeng/toast';
import { FloatLabel                                           } from 'primeng/floatlabel';
import { AutoCompleteModule                                   } from 'primeng/autocomplete';
import { SelectModule                                         } from 'primeng/select';
import { ButtonModule                                         } from 'primeng/button';
import { TagModule                                            } from 'primeng/tag';
import { CheckboxModule                                       } from 'primeng/checkbox';
import { DialogService, DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,

    TableModule,
    ToastModule,
    FloatLabel,
    AutoCompleteModule,
    SelectModule,
    ButtonModule,
    TagModule,
    CheckboxModule,
    DynamicDialogModule,
  ],
  providers: [
    DialogService,
    MessageService
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private clientService     = inject(ClientService);
  private dictionaryService = inject(DictionaryService);
  private loadingService    = inject(LoadingService);
  private router            = inject(Router);
  private fb                = inject(FormBuilder);

  private readonly dialogService  = inject(DialogService);
  private readonly messageService = inject(MessageService);

  private dialogRef ?: DynamicDialogRef | null = null;

  filterForm = this.fb.group({
    companyType       : [null as CompanyTypeSelect | null],
    companyName       : [null as CompanyAutocomplete | null],
    nip               : [null as NipAutocomplete | null],
    owner             : [null as OwnerAutocomplete | null],
    cooperationStatus : [null as CooperationStatus | null],
  });

  clientsList      = signal<Client[]>([]); 
  dictionariesList = signal<any>({});

  companyTypeList   : any = [];
  cooperationStatus : any = [];

  nipList         = signal<NipAutocomplete[]>    ([]);
  ownerList       = signal<OwnerAutocomplete[]>  ([]);
  companyNameList = signal<CompanyAutocomplete[]>([]);

  ngOnInit() {
    this.loadingService.show();
    this.loadingService.show();

    this.clientService.getClients().subscribe({
      next: (response: any) => {
        this.clientsList.set(response);
        console.log(this.clientsList());
      }, 
      error: (error: any) => {
        console.log('Błąd podczas pobierania klientów: ', error);
      },
      complete: () => {
        this.loadingService.hide();
      }
    });

    this.dictionaryService.getDictionary().subscribe({
      next: (response: any) => {
        this.dictionariesList.set(response);

        this.companyTypeList   = this.dictionariesList().company_type ?? [];
        this.cooperationStatus = this.dictionariesList().cooperation_status ?? [];
      }, 
      error: (error: any) => {
        console.log('Błąd podczas pobierania słowniku: ', error);
      },
      complete: () => {
        this.loadingService.hide();
      }
    });
  }


  // autocompletes

  searchNip(event: any) {
    this.clientService.autocomplete('nip', event.query).subscribe((response: any) => {
      this.nipList.set(response);
    });
  }

  searchOwner(event: any) {
    this.clientService.autocomplete('owner', event.query).subscribe((response: any) => {
      this.ownerList.set(response);
    });
  }

  searchCompanyName(event: any) {
    this.clientService.autocomplete('company_name', event.query).subscribe((response: any) => {
      this.companyNameList.set(response);
    });
  }


  // filters

  search() {
    this.loadingService.show();

    const filters = this.filterForm.getRawValue();

    let obj = {
      cooperation_status : filters.cooperationStatus?.value,
      company_name       : filters.companyName?.company_name,
      company_type       : filters.companyType?.value,
      nip                : filters.nip?.nip,
      owner              : filters.owner?.owner
    }

    const request = removeEmptyProperties(obj);

    this.clientService.search(request).subscribe({
      next: (response: any) => {
        this.clientsList.set(response);
      },
      error: (error: any) => {
        console.log('Błąd pobierania danych: ', error);
      },
      complete: () => {
        this.loadingService.hide();
      }
    })
  }

  resetFilters() {
    this.filterForm.reset({
      cooperationStatus : null,
      companyName       : null,
      companyType       : null,
      nip               : null,
      owner             : null,
    });

    this.search();
  }


  // dialogs

  openEditBasicClientDialog(client: any) {
    this.dialogRef = this.dialogService.open(EditBasicClientDialog, {
      header      : `Edycja danych klienta: ${ client?.company_name }`,
      width       : '600px',
      modal       : true,
      closable    : false,
      maximizable : false,
      draggable   : false,
      data: {
        client
      }
    });

    this.dialogRef?.onClose.subscribe((result: any) => {
      if(!result) {
        return;
      }

      this.messageService.add({ key: 'edit-client', severity: 'success', summary: 'Komunikat', detail: result.message });

      this.search();
    });
  }

  openCreateBasicClientDialog() {
    this.dialogRef = this.dialogService.open(CreateBasicClientDialog, {
      header      : 'Dodaj nowego klienta',
      width       : '800px',
      modal       : true,
      closable    : false,
      maximizable : false,
      draggable   : false,
    });

    this.dialogRef?.onClose.subscribe((result: any) => {
      if(!result) {
        return;
      }

      this.messageService.add({ key: 'create-client', severity: 'success', summary: 'Komunikat', detail: result.message });

      this.search();
    });
  }


  // redirects

  redirectToClientDetails(id: number) {
    this.router.navigate(['/client', id]);
  }
}
