import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { CompanyTypeSelect } from '../../../../core/models';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { DictionaryService } from '../../../../core/services/dictionary.service';
import { UserService       } from '../../../../core/services/user.service';

import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    DatePickerModule,
  ],
  templateUrl: './edit-basic-client-dialog.html',
  styleUrl: './edit-basic-client-dialog.scss',
})
export class EditBasicClientDialog {
  private readonly dialogRef  = inject(DynamicDialogRef);
  private readonly config     = inject(DynamicDialogConfig);
  private readonly destroyRef = inject(DestroyRef)

  private fb                  = inject(FormBuilder);
  private dictionaryService   = inject(DictionaryService);
  private userService         = inject(UserService);

  readonly dictionariesList = signal<any>({});
  readonly usersList = signal<any>([]);
  readonly cooperationStatuList = computed(() => this.dictionariesList().cooperation_status ?? []);

  editForm = this.fb.nonNullable.group({
    cooperationStatus    : '',
    cooperationEndedDate : this.fb.control<Date | null>(null),
    accountManager       : '',
    phone                : '',
    email                : '',
    isVatPayer           : false,
    notes                : ''
  });

  ngOnInit(): void {    
    const client = this.config.data?.client;

    if(!client) {
      return;
    } 

    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.usersList.set(response);
        console.log('Lista opiekunów: ', this.usersList());
      },
      error: (error: any) => {
        console.log('Błąd pobierania listy opiekunów: ', error);
      },
      complete: () => {

      }
    });

    this.dictionaryService.getDictionary().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((response: any) => {
      this.dictionariesList.set(response);
      this.fillForm(client);
    });

    this.editForm.controls.cooperationStatus.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((status: any) => {
      if(status !== 'cooperation_ended') {
        this.editForm.controls.cooperationEndedDate.setValue(null);
      }
    });
  }

  private fillForm(client: any): void {
    this.editForm.patchValue({
      cooperationStatus : client.cooperation_status ?? '',
      accountManager    : client.account_manager ?? '',
      phone             : client.phone ?? '', 
      email             : client.email ?? '', 
      isVatPayer        : client.is_vat_payer === 1, 
      notes             : client.notes ?? ''
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    console.log(this.editForm.getRawValue());
  }
}
