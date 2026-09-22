import { Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { ClientImportRow } from '../../../core/models/client-import.model';

import { DictionaryService } from '../../../core/services/dictionary.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-clients-import',
  imports: [
    FormsModule,

    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './clients-import.html',
  styleUrl: './clients-import.scss',
})
export class ClientsImport {
  private readonly dictionaryService = inject(DictionaryService);
  private readonly userService = inject(UserService);

  readonly selectedFile = signal<File | null>(null);
  readonly rows = signal<ClientImportRow[]>([]);
  readonly showPreview = signal(false);
  
  dictionariesList = signal<any>({});
  usersList = signal<any[]>([]);

  ngOnInit() {
    this.dictionaryService.getDictionary().subscribe({
      next: (response: any) => {
        this.dictionariesList.set(response);
        console.log('Dictionaries list: ', this.dictionariesList());
      },
      error: (error: any) => {
        console.log('Dictionaries error: ', error);
      }
    });

    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.usersList.set(response);
        console.log('Users list: ', this.usersList());
      },
      error: (error) => {
        console.log('Users list error: ', error);
      }
    })
  }

  get validRows(): number {
    return this.rows().filter(row => row.valid).length;
  }

  get invalidRows(): number {
    return this.rows().filter(row => !row.valid).length;
  }

  get hasErrors(): boolean {
    return this.invalidRows > 0;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if(!file) {
      return;
    }

    this.selectedFile.set(file);
    this.loadMockData();
    this.showPreview.set(true);
  }

  changeFile(): void {
    this.selectedFile.set(null);
    this.showPreview.set(false);
    this.rows.set([]);
  }

  cancelImport(): void {
    this.selectedFile.set(null);
    this.showPreview.set(false);
    this.rows.set([]);
  }

  importClients(): void {
    if(this.hasErrors) {
      return;
    }

    console.log('Client import: ', this.rows());
  }

  private loadMockData(): void {
    const rows: ClientImportRow[] = [
      {
        id: 1,
        company_type: 'limited_company',
        company_name: 'ABC Sp. z o.o.',
        first_name: '',
        last_name: '',
        nip: '1234563218',
        regon: '123456789',
        krs: '0000123456',
        pesel: '',
        email: 'kontakt@abc.pl',
        phone: '123456789',
        is_vat_payer: true,
        cooperation_status: 'active',
        account_manager_id: 1,
        notes: '',
        errors: {},
        valid: true,
      },
      {
        id: 2,
        company_type: '',
        company_name: 'XYZ Sp. z o.o.',
        first_name: '',
        last_name: '',
        nip: '',
        regon: '',
        krs: '',
        pesel: '',
        email: 'xyz.pl',
        phone: '',
        is_vat_payer: true,
        cooperation_status: 'active',
        account_manager_id: 2,
        notes: '',
        errors: {},
        valid: false,
      },
    ];

    rows.forEach(row => this.validateRowData(row));

    this.rows.set(rows);
  }

  validateRow(row: ClientImportRow): void {
    this.validateRowData(row);

    this.rows.update(rows => [...rows]);
  }

  private validateRowData(row: ClientImportRow): void {
    const errors: Record<string, string> = {};

    this.validateCompanyType(row, errors);
    this.validateCompanyName(row, errors);
    this.validateFirstName(row, errors);
    this.validateLastName(row, errors);
    this.validateNip(row, errors);
    this.validateRegon(row, errors);
    this.validateKrs(row, errors);
    this.validatePesel(row, errors);
    this.validateEmail(row, errors);
    this.validatePhone(row, errors);
    this.validateVatPayer(row, errors);
    this.validateCooperationStatus(row, errors);
    this.validateAccountManager(row, errors);
    this.validateNotes(row, errors);

    row.errors = errors;
    row.valid = Object.keys(errors).length === 0;
  }

  private validateCompanyType(row: ClientImportRow, errors: Record<string, string>) {
    if(!row.company_type) {
      errors['company_type'] = 'Typ klienta jest wymagany.';
      return;
    }

    const exists = this.dictionariesList().company_type?.some((item: any) => item.value == row.company_type);

    if(!exists) {
      errors['company_type'] = 'Wybrany typ klienta nie istnieje.';
    }
  }

  private validateCompanyName(row: ClientImportRow, errors: Record<string, string>) {
    const value = row.company_name?.trim() ?? '';

    if(!value) {
      errors['company_name'] = 'Nazwa firmy jest wymagana.';
      return;
    }

    if(value.length > 255) {
      errors['company_name'] = 'Nazwa firmy może mieć maksymalnie 255 znaków.';
    }
  }

  private validateFirstName(row: ClientImportRow, errors: Record<string, string>) {
    const value = row.first_name?.trim() ?? '';

    if(!value) {
      errors['first_name'] = 'Imię jest wymagane.';
      return;
    } 

    if(value.length > 100) {
      errors['first_name'] = 'Imię może mieć maksymalnie 100 znaków';
    }
  }

  private validateLastName(row: ClientImportRow, errors: Record<string, string>) {
    const value = row.last_name?.trim() ?? '';

    if(!value) {
      errors['last_name'] = 'Nazwisko jest wymagane.'; 
      return;
    }

    if(value.length > 100) {
      errors['last_name'] = 'Nazwisko może mieć maksymalnie 100 znaków.';
    }
  }

  private validateNip(row: ClientImportRow, errors: Record<string, string>) {
    const value = row.nip?.trim() ?? '';

    if(!value) {
      errors['nip'] = 'NIP jest wymagany.';
      return;
    }

    if(!/^\d{10}$/.test(value)) {
      errors['nip'] = 'NIP musi zawierać dokładnie 10 cyfr.';
      return;
    }

    const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];

    const checksum = weights.reduce((sum, weight, index) => sum + Number(value[index]) * weight, 0) % 11;

    if(checksum === 10 || checksum !== Number(value[9])) {
      errors['nip'] = 'Nieprawidłowy numer NIP.';
    }
  }

  private validateRegon(row: ClientImportRow, errors: Record<string, string>) {
    const value = row.regon?.trim() ?? '';

    if (!value) {
      errors['regon'] = 'REGON jest wymagany';
      return;
    }

    if (!/^\d{9}$/.test(value)) {
      errors['regon'] = 'REGON musi zawierać dokładnie 9 cyfr.';
      return;
    }

    const weights = [8, 9, 2, 3, 4, 5, 6, 7, 8];

    const checksum = weights.reduce((sum, weight, index) => sum + Number(value[index]) * weight, 0) % 11 % 10;

    if (checksum !== Number(value[8])) {
      errors['regon'] = 'Nieprawidłowy numer REGON.';
    }
  }

  private validateKrs(row: ClientImportRow, errors: Record<string, string>) {

  }

  private validatePesel(row: ClientImportRow, errors: Record<string, string>) {

  }

  private validateEmail(row: ClientImportRow, errors: Record<string, string>) {

  }

  private validatePhone(row: ClientImportRow, errors: Record<string, string>) {

  }

  private validateVatPayer(row: ClientImportRow, errors: Record<string, string>) {

  }

  private validateCooperationStatus(row: ClientImportRow, errors: Record<string, string>) {

  }

  private validateAccountManager(row: ClientImportRow, errors: Record<string, string>) {

  }

  private validateNotes(row: ClientImportRow, errors: Record<string, string>) {

  }
}
