import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';

import { DictionaryService } from '../../../../core/services/dictionary.service';
import { ContactService } from '../../../../core/services/contact.service';

@Component({
  selector: 'app-client-contact-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    SelectModule,
    InputTextModule,
    ButtonModule,
    TooltipModule,
    ToastModule,
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './client-contact-form-dialog.html',
  styleUrl: './client-contact-form-dialog.scss',
})
export class ClientContactFormDialog {
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly config    = inject(DynamicDialogConfig);

  private dictionaryService = inject(DictionaryService);
  private contactService    = inject(ContactService);
  private messageService    = inject(MessageService);

  private fb = inject(FormBuilder);

  dictionariesList = signal<any>({}); 
  saving           = signal<any>(false)

  form = this.fb.nonNullable.group({
    firstName  : ['', [ Validators.required ]],
    lastName   : ['', [ Validators.required ]],
    positionId : ['', [ Validators.required ]],
    phone      : ['', [ Validators.required ]],
    email      : ['', [ Validators.required ]],
    notes      : ['']
  });

  ngOnInit(): void {
    this.dictionaryService.getDictionary().subscribe({
      next: (response: any) => {
        this.dictionariesList.set(response.position);
        console.log('Position list: ', this.dictionariesList());

        console.log(this.config.data?.type);

        if(this.config.data?.type == 'update') {
          this.form.patchValue(this.config.data?.data);
        }
      }
    })
  }

  save() {
    console.log(this.form.getRawValue());
    if(this.form.invalid) {
      this.messageService.add({ key: 'invalid', severity: 'error', summary: 'Komunikat', detail: 'Uzupełnij poprawnie pola w formularzu.' });
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    if(this.config.data?.type == 'create') {
      this.contactService.create(this.config.data?.clientId, this.form.getRawValue()).subscribe({
        next: (response: any) => {
          this.saving.set(false);

          this.messageService.add({ key: 'save', severity: 'success', summary: 'Komunikat', detail: response?.message, life: 2000 });

          setTimeout(() => {
            this.dialogRef.close(response);
          }, 2000);
        },
        error: (error) => {
          this.saving.set(false);
          this.messageService.add({ key: 'save', severity: 'error', summary: 'Komunikat', detail: error.message });
        }
      });
    } else {
      this.contactService.update(this.config.data?.data?.id, this.form.getRawValue()).subscribe({
        next: (response: any) => {
          this.saving.set(false);

          this.messageService.add({ key: 'save', severity: 'success', summary: 'Komunikat', detail: response?.message, life: 2000 });

          setTimeout(() => {
            this.dialogRef.close(response);
          }, 2000);
        },
        error: (error: any) => {
          this.saving.set(false);
          this.messageService.add({ key: 'save', severity: 'error', summary: 'Komunikat', detail: error.message });
        }
      })
    }
  }

  close() {
    this.dialogRef.close();
  }
}
