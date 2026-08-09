import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { CompanyTypeSelect } from '../../../../core/models';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { DictionaryService } from '../../../../core/services/dictionary.service';

import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-edit-basic-client-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    ButtonModule,
    ToggleSwitchModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './edit-basic-client-dialog.html',
  styleUrl: './edit-basic-client-dialog.scss',
})
export class EditBasicClientDialog {
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly config    = inject(DynamicDialogConfig);
  private fb                 = inject(FormBuilder);
  private dictionaryService = inject(DictionaryService);

  readonly dictionariesList = signal<any>({});
  readonly companyTypeList = computed(() => this.dictionariesList().company_type ?? []);

  editForm = this.fb.nonNullable.group({
    companyType : '',
    phone       : '',
    email       : '',
    isVatPayer  : false,
    isActive    : false,
    notes       : ''
  });

  ngOnInit(): void {    
    const client = this.config.data?.client;

    if(!client) {
      return;
    } 

    this.dictionaryService.getDictionary().subscribe((response: any) => {
      this.dictionariesList.set(response);
      this.fillForm(client);
    });
  }

  private fillForm(client: any): void {
    this.editForm.patchValue({
      companyType : client.company_type ?? '', 
      phone       : client.phone ?? '', 
      email       : client.email ?? '', 
      isVatPayer  : client.is_vat_payer === 1, 
      isActive    : client.is_active === 1,
      notes       : client.notes ?? ''
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
