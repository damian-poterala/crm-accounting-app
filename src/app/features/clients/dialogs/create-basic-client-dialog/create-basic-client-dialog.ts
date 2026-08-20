import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';

import { DictionaryService } from '../../../../core/services/dictionary.service';
import { UserService       } from '../../../../core/services/user.service';
import { ClientService     } from '../../../../core/services/client.service';

@Component({
  selector: 'app-create-basic-client-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,

    SelectModule,
    InputTextModule,
    ToggleSwitchModule,
    TextareaModule,
    ButtonModule
  ],
  templateUrl: './create-basic-client-dialog.html',
  styleUrl: './create-basic-client-dialog.scss',
})
export class CreateBasicClientDialog {
  private readonly dialogRef  = inject(DynamicDialogRef);
  private readonly config     = inject(DynamicDialogConfig);

  private dictionaryService = inject(DictionaryService);
  private userService       = inject(UserService);
  private clientService     = inject(ClientService);

  private fb = inject(FormBuilder);

  dictionariesList = signal<any>({});
  usersList        = signal<any>([]);

  createForm = this.fb.nonNullable.group({
    companyType    : '',
    companyName    : '',
    nip            : '',
    regon          : '',
    krs            : '',
    isVatPayer     : false,
    accountManager : '',
    firstName      : '',
    lastName       : '',
    pesel          : '', 
    email          : '',
    phone          : '',
    notes          : '',
  });

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.usersList.set(response);
        console.log("Lista opiekunów: ", this.usersList());
      },
      error: (error: any) => {
        console.log('Błąd pobierania listy opiekunów: ', error);
      } 
    });

    this.dictionaryService.getDictionary().subscribe({
      next: (response: any) => {
        this.dictionariesList.set(response);
        console.log('Słownik: ', this.dictionariesList());
      },
      error: (error: any) => {
        console.log('Bąd pobierania listy słownikowej: ', error);
      }
    });
  }

  save(): void {
    console.log(this.createForm.getRawValue());

    this.clientService.create(this.createForm.getRawValue()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.close();
      },
      error: (error: any) => {
        console.log('Błąd podczas zapisu nowego klienta: ', error);
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

}
