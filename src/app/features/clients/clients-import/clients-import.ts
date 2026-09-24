import { Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { firstValueFrom } from 'rxjs';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

import { ClientImportRow   } from '../../../core/models/client-import.model';
import { ClientImportError } from '../../../core/models/client-import.model';

import { DictionaryService } from '../../../core/services/dictionary.service';
import { UserService } from '../../../core/services/user.service';
import { ClientService } from '../../../core/services/client.service';

import { MessageService } from 'primeng/api';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-clients-import',
  standalone: true,
  imports: [
    FormsModule,

    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    SelectModule,
    ToastModule,
  ],
  providers: [
    MessageService
  ],
  templateUrl: './clients-import.html',
  styleUrl: './clients-import.scss',
})
export class ClientsImport {
  private readonly dictionaryService = inject(DictionaryService);
  private readonly userService       = inject(UserService);
  private readonly clientService     = inject(ClientService);
  private readonly messageService    = inject(MessageService)
  
  readonly isImporting    = signal(false);
  readonly importProgress = signal(0);
  readonly  importTotal   = signal(0);
  readonly importErrors   = signal<ClientImportError[]>([]);
  readonly importFinished = signal(false);

  readonly selectedFile = signal<File | null>(null);
  readonly rows         = signal<ClientImportRow[]>([]);
  readonly showPreview  = signal(false);
  
  dictionariesList = signal<any>({});
  usersList        = signal<any[]>([]);

  private readonly excelHeaders = [
    'Typ klienta',
    'Nazwa firmy',
    'Imię',
    'Nazwisko',
    'NIP',
    'REGON',
    'KRS',
    'PESEL',
    'E-mail',
    'Telefon',
    'Płatnik VAT',
    'Status współpracy',
    'Opiekun',
    'Uwagi'
  ]

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

  get canImport(): boolean {
    return this.rows().length > 0 && !this.hasErrors;
  }

  getRowErrors(row: ClientImportRow): string {
    return Object.values(row.errors).join('\n');
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if(!file) {
      return;
    }

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if(fileExtension !== 'xlsx' && fileExtension !== 'xls') {
        this.messageService.add({ severity: 'error', summary: 'Błąd importu', detail: 'Nieprawidłowy format pliku. Wybierz plik XLSX lub XLS.' });
      }

      const rows = await this.readExcelFile(file);

      if(rows.length == 0) {
        this.messageService.add({ severity: 'warn', summary: 'Brak danych', detail: 'Wybrany plik nie zawiera żadnych rekordów do importu.' });
        
        input.value = '';
        return;
      }

      this.selectedFile.set(file);
      this.rows.set(rows);
      this.showPreview.set(true);
    } catch (error) {
      console.log('Excel import error: ', error);

      this.messageService.add({ severity: 'error', summary: 'Błąd importu', detail: error instanceof Error ? error.message : 'Nie udało się odczytać pliku Excel.' });
      
      input.value = '';
    }
  }

  private async readExcelFile(file: File): Promise<ClientImportRow[]> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { cellDates: false });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    if(!worksheet) {
      throw new Error('Nie znaleziono arkusza w pliku Excel');
    }

    const data = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { 
      header: 1,
      defval: '',
      raw: false,
      blankrows: false, 
    });

    if(!data.length) {
      throw new Error('Arkusz "Klienci" jest pusty.');
    }

    const headers = data[0].map(value => String(value).trim());

    this.validateExcelHeaders(headers);

    const rows = data.slice(1).filter(row => this.hasExcelData(row));

    const clients = rows.map((row, index) => {
      const client: ClientImportRow = {
        id: index + 1,
        company_type: this.mapCompanyType(row[0]),
        company_name: this.toStringValue(row[1]),
        first_name: this.toStringValue(row[2]),
        last_name: this.toStringValue(row[3]),
        nip: this.toStringValue(row[4]),
        regon: this.toStringValue(row[5]),
        krs: this.toStringValue(row[6]),
        pesel: this.toStringValue(row[7]),
        email: this.toStringValue(row[8]),
        phone: this.toStringValue(row[9]),
        is_vat_payer: this.mapVatPayer(row[10]),
        cooperation_status: this.mapCooperationStatus(row[11]),
        account_manager_id: this.mapAccountManager(row[12]),
        notes: this.toStringValue(row[13]),
        errors: {},
        valid: false,
        imported: false,
      };

      this.validateRowData(client);
      return client;
    });

    this.validateDuplicates(clients);
    return clients;
  }

  private validateDuplicates(rows: ClientImportRow[]): void {
    this.validateDuplicateField(rows, 'nip', 'NIP');
    this.validateDuplicateField(rows, 'regon', 'REGON');
    this.validateDuplicateField(rows, 'krs', 'KRS');
  }

  private validateDuplicateField(rows: ClientImportRow[], field: 'nip' | 'regon' | 'krs', label: string) {
    const duplicateMessage = `Duplikat ${ label } w pliku importowym.`;

    rows.forEach(row => {
      if(row.errors[field] == duplicateMessage) {
        delete row.errors[field];
      }
    });
    
    const values = new Map<string, ClientImportRow[]>();

    rows.forEach(row => {
      const value = row[field];

      if(!value) {
        return;
      }

      const existing = values.get(value) ?? [];
      existing.push(row);
      values.set(value, existing);
    });

    values.forEach(duplicateRows => {
      if(duplicateRows.length < 2) {
        return;
      }

      duplicateRows.forEach(row => {
        row.errors[field] = duplicateMessage;
        row.valid = false;
      });
    });

    rows.forEach(row => {
      row.valid = Object.keys(row.errors).length == 0;
    });
  }

  private hasExcelData(row: unknown[]): boolean {
    return row.some(value => {
      if(value == null || value == undefined) {
        return false;
      }

      return String(value).trim() != '';
    });
  }

  private validateExcelHeaders(headers: string[]): void {
    if(headers.length !== this.excelHeaders.length) {
      throw new Error(`Nieprawidłowa liczba kolumn. Oczekiwano ${ this.excelHeaders.length }, znaleziono ${ headers.length }.`);
    }

    this.excelHeaders.forEach((header, index) => {
      if(headers[index] != header) {
        throw new Error(`Nieprawidłowa nazwa kolumn ${ index + 1 }. Oczekiwano "${ header }", znaleziono "${ headers[index] || '(pusta)' }".`);
      }
    });
  }

  private toStringValue(value: unknown): string {
    if(value == null || value == undefined) {
      return '';
    }

    return String(value).trim();
  }

  private mapCompanyType(value: unknown): string {
    const label = this.toStringValue(value);

    const option = this.dictionariesList().company_type?.find((item: any) => item?.label == label);

    return option?.value ?? label;
  }

  private mapCooperationStatus(value: unknown): string {
    const label = this.toStringValue(value);

    const option = this.dictionariesList().cooperation_status?.find((item: any) => item?.label == label);

    return option?.value ?? label;
  }

  private mapVatPayer(value: unknown): boolean | null {
    const normalized = this.toStringValue(value).toLowerCase();

    if(normalized == 'tak') {
      return true;
    }

    if(normalized == 'nie') {
      return false;
    }

    return null;
  }

  private mapAccountManager(value: unknown): number | null {
    const username = this.toStringValue(value);

    if(!username) {
      return null;
    }

    const user = this.usersList().find(item => item.username == username);

    return user?.id ?? null;
  }

  changeFile(): void {
    this.selectedFile.set(null);
    this.showPreview.set(false);
    this.rows.set([]);
  }

  cancelImport(): void {
    if(this.isImporting()) {
      return;
    }

    this.selectedFile.set(null);
    this.showPreview.set(false);
    this.rows.set([]);
  
    this.importFinished.set(false);
    this.importErrors.set([]);
    this.importProgress.set(0);
    this.importTotal.set(0);
  }

  downloadTemplate(): void {
    const link = document.createElement('a');
    
    link.href = '/templates/clients-import-template.xlsx';
    link.download = 'clients-import-template.xlsx';

    link.click();
  }

  async importClients(): Promise<void> {
    if(!this.canImport || this.isImporting()) {
      return;
    }

    const rows = this.rows();

    this.isImporting.set(true);
    this.importFinished.set(false);
    this.importErrors.set([]);
    this.importProgress.set(0);
    this.importTotal.set(rows.length);

    for(let i = 0; i < rows.length; i++) {
      const row = rows[i];

      try {
        await firstValueFrom(
          this.clientService.importClient({
            companyType: row.company_type,
            companyName: row.company_name,
            firstName: row.first_name,
            lastName: row.last_name,
            nip: row.nip,
            regon: row.regon,
            krs: row.krs,
            pesel: row.pesel,
            email: row.email,
            phone: row.phone,
            isVatPayer: row.is_vat_payer,
            cooperationStatus: row.cooperation_status,
            accountManager: row.account_manager_id,
            notes: row.notes,
          })
        );

        row.imported = true;
      } catch (error: any) {
        this.importErrors.update(errors => [
          ...errors,
          {
            row: row.id,
            companyName: row.company_name,
            nip: row.nip,
            error: this.getImportErrorMessage(error)
          }
        ]);

        row.imported = false;
      }

      this.importProgress.set(i + 1);
      this.rows.update(currentRows => [...currentRows]);
    }

    this.isImporting.set(false);
    this.importFinished.set(true);
  }

  private getImportErrorMessage(error: any): string {
    if(error?.error?.message) {
      return error.error.message;
    }

    if(error?.message) {
      return error.message;
    }

    return 'Nie udało się zaimportować klienta.';
  }

  validateRow(row: ClientImportRow): void {
    this.validateRowData(row);

    this.rows.update(rows => {
      this.validateDuplicates(rows);
      return [...rows];
    })
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
  }

  private validateRegon(row: ClientImportRow, errors: Record<string, string>) {
    const value = row.regon?.trim() ?? '';

    if (!value) {
      return;
    }

    if (!/^\d{9}$/.test(value)) {
      errors['regon'] = 'REGON musi zawierać dokładnie 9 cyfr.';
      return;
    }
  }

  private validateKrs(row: ClientImportRow, errors: Record<string, string>) {
    const value = row.krs?.trim() ?? '';

    if(!value) {
      return;
    }

    if(!/^\d{10}$/.test(value)) {
      errors['krs'] = 'KRS musi zawierać dokładnie 10 cyfr.';
    }
  }

  private validatePesel(row: ClientImportRow, errors: Record<string, string>) {
    const value = row.pesel?.trim() ?? '';

    if(!value) {
      return;
    }

    if(!/^\d{11}$/.test(value)) {
      errors['pesel'] = 'PESEL musi zawierać dokładnie 11 cyfr.';
    }
  }

  private validateEmail(row: ClientImportRow, errors: Record<string, string>) {
    const value = row.email?.trim() ?? '';

    if(!value) {
      return;
    }

    if(value.length > 255) {
      errors['email'] = 'E-mail może mieć maksymalnie 255 znaków.';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(value)) {
      errors['email'] = 'Nieprawidłowy adres e-mail.';
    }
  }

  private validatePhone(row: ClientImportRow, errors: Record<string, string>) {
    const value = row.phone?.trim() ?? '';

    if(!value) {
      return;
    }

    if(value.length > 20) {
      errors['phone'] = 'Telefon może mieć maksymalnie 20 znaków.';
      return;
    }

    if(!/^[0-9+()\-\s]+$/.test(value)) {
      errors['phone'] = 'Nieprawidłowy format numeru telefonu.';
    }
  }

  private validateVatPayer(row: ClientImportRow, errors: Record<string, string>) {
    if(typeof row.is_vat_payer !== 'boolean') {
      errors['is_vat_payer'] = 'Określ czy klient jest płatnikiem VAT.';
    } 
  }

  private validateCooperationStatus(row: ClientImportRow, errors: Record<string, string>) {
    if(!row.cooperation_status) {
      errors['cooperation_status'] = 'Status współpracy jest wymagany.';
      return;
    }

    const exists = this.dictionariesList().cooperation_status?.some((item: any) => item.value == row.cooperation_status);

    if(!exists) {
      errors['cooperation_status'] = 'Wybrany status współpracy nie istnieje.';
    }
  }

  private validateAccountManager(row: ClientImportRow, errors: Record<string, string>) {
    if(!row.account_manager_id) {
      errors['account_manager_id'] = 'Opiekun klienta jest wymagany.';
      return;
    }

    const exists = this.usersList().some((item: any) => item.id === row.account_manager_id);

    if(!exists) {
      errors['account_manager_id'] = 'Wybrany opiekun nie istnieje.';
    }
  }

  private validateNotes(row: ClientImportRow, errors: Record<string, string>) {
    if(typeof row.notes !== 'string') {
      errors['notes'] = 'Nieprawidłowa wartość uwag.';
    }
  }
}
