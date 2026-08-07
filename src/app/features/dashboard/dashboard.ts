import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { 
  CompanyAutocomplete, 
  NipAutocomplete, 
  OwnerAutocomplete, 
  CompanyTypeSelect,
  Client 
} from '../../core/models';

import { removeEmptyProperties } from '../../core/utils/object.utils';

import { Navbar } from '../../layout/navbar/navbar';
import { EditBasicClientDialog } from '../clients/dialogs/edit-basic-client-dialog/edit-basic-client-dialog';

import { ClientService } from '../../core/services/client.service';
import { DictionaryService } from '../../core/services/dictionary.service';

import { TableModule        } from 'primeng/table';
import { FloatLabel         } from 'primeng/floatlabel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule       } from 'primeng/select';
import { ButtonModule       } from 'primeng/button';
import { TagModule          } from 'primeng/tag';
import { CheckboxModule     } from 'primeng/checkbox';
import { DialogService, DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    Navbar,

    DatePipe,
    ReactiveFormsModule,

    TableModule,
    FloatLabel,
    AutoCompleteModule,
    SelectModule,
    ButtonModule,
    TagModule,
    CheckboxModule,
    DynamicDialogModule,
  ],
  providers: [
    DialogService
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private clientService     = inject(ClientService);
  private dictionaryService = inject(DictionaryService);
  private router            = inject(Router);
  private fb                = inject(FormBuilder);

  private readonly dialogService = inject(DialogService);

  private dialogRef ?: DynamicDialogRef | null = null;

  filterForm = this.fb.group({
    companyType : [null as CompanyTypeSelect | null],
    companyName : [null as CompanyAutocomplete | null],
    nip         : [null as NipAutocomplete | null],
    owner       : [null as OwnerAutocomplete | null],
    active      : [true]
  });

  clientsList      = signal<Client[]>([]); 
  dictionariesList = signal<any>({});

  companyTypeList: any = [];

  nipList         = signal<NipAutocomplete[]>    ([]);
  ownerList       = signal<OwnerAutocomplete[]>  ([]);
  companyNameList = signal<CompanyAutocomplete[]>([]);

  ngOnInit() {
    this.clientService.getClients().subscribe((response: any) => {
      this.clientsList.set(response);
      console.log(this.clientsList());
    });

    this.dictionaryService.getDictionary().subscribe((response: any) => {
      this.dictionariesList.set(response);
      console.log(this.dictionariesList());

      this.companyTypeList = this.dictionariesList().company_type ?? [];
      console.log(this.companyTypeList);
    })
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
    const filters = this.filterForm.getRawValue();

    let obj = {
      is_active    : filters.active,
      company_name : filters.companyName?.company_name,
      company_type : filters.companyType?.value,
      nip          : filters.nip?.nip,
      owner        : filters.owner?.owner
    }
    const request = removeEmptyProperties(obj);
    console.log(request);

    this.clientService.search(request).subscribe((response: any) => {
      this.clientsList.set(response);
    });
  }

  resetFilters() {
    this.filterForm.reset({
      active      : null,
      companyName : null,
      companyType : null,
      nip         : null,
      owner       : null,
    });

    this.search();
  }


  // dialogs

  openEditBasicClientDialog(companyName: string) {
    this.dialogRef = this.dialogService.open(EditBasicClientDialog, {
      header      : `Edycja danych klienta: ${ companyName }`,
      width       : '600px',
      modal       : true,
      closable    : false,
      maximizable : false,
      draggable   : false,
    });
  }


  // redirects

  redirectToClientDetails(id: number) {
    this.router.navigate(['/client', id]);
  }
}
