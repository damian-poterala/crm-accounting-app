import { Component, OnDestroy, inject, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { ClientService } from '../../core/services/client.service';

interface ContractForm {
  companyName: string;
  nip: string;
  regon: string;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-contract-creator-view',
  standalone: true,
  imports: [
    FormsModule,

    AutoCompleteModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './contract-creator-view.html',
  styleUrl: './contract-creator-view.scss',
})
export class ContractCreatorView implements OnDestroy {
  @ViewChild('fileInput')
  fileInput ?: ElementRef<HTMLInputElement>;

  private readonly clientService = inject(ClientService);
  private readonly sanitizer = inject(DomSanitizer);

  selectedClient: any | null = null;
  clientSuggestions: any[] = [];

  form: any = this.emptyForm();

  selectedFile: File | null = null;
  pdfPreviewUrl: SafeResourceUrl | null = null;
  
  private objectUrl: string | null = null;

  errorMessage = '';
  successMessage = '';

  searchClients(event: { query: string }): void {

  }

  onClientSelected(event: any): void {
    const client = event.value;
    this.selectedClient = client;

    this.form = {
      companyName: client.company_name ?? '',
      nip: client.nip ?? '',
      regon: client.regon ?? '',
      firstName: client.first_name ?? '',
      lastName: client.last_name ?? '',
      address: client.address ?? '',
      email: client.email ?? '',
      phone: client.phone ?? ''
    }

    this.errorMessage = '';
    this.successMessage = '';
  }

  onClientCleared(): void {
    this.selectedClient = null;
    this.form = this.emptyForm();
    this.errorMessage = '';
    this.successMessage = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.errorMessage = '';
    this.successMessage = '';

    if(!file) {
      return;
    }

    const isPdf = file.type == 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if(!isPdf) {
      this.errorMessage = 'Wybierz dokument w formacie PDF.';
      input.value = '';
      return;
    }

    this.clearPdfPreview();

    this.selectedFile = file;
    this.objectUrl = URL.createObjectURL(file);
    this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
  }

  removeFile(): void {
    this.clearPdfPreview();
    this.selectedFile = null;
    this.errorMessage = '';
    this.successMessage = '';

    if(this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  prepareContract(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if(!this.selectedClient) {
      this.errorMessage = 'Najpierw wybierz klienta.';
      return;
    }

    if(!this.selectedFile) {
      this.errorMessage = 'Najpierw wgraj wzór umowy w formacie PDF.';
    }

    this.successMessage = 'Dane są gotowe. Generowanie i uzupełnianie PDF podepniemy po ustaleniu struktury wzoru.'
  }

  private emptyForm() {
    return {
      companyName: '',
      nip: '',
      regon: '',
      firstName: '',
      lastName: '',
      address: '',
      email: '',
      phone: ''
    };
  }

  private clearPdfPreview(): void {
    if(this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }

    this.pdfPreviewUrl = null;
  }

  ngOnDestroy(): void {
    this.clearPdfPreview();
  }
}
