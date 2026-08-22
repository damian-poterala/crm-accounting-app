import { Component, inject, signal        } from '@angular/core';
import { CommonModule                     } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize                         } from 'rxjs';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef    } from 'primeng/dynamicdialog';

import { SelectModule       } from 'primeng/select';
import { InputTextModule    } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule     } from 'primeng/textarea';
import { ButtonModule       } from 'primeng/button';
import { TooltipModule      } from 'primeng/tooltip';
import { IconFieldModule    } from 'primeng/iconfield';
import { InputIconModule    } from 'primeng/inputicon';
import { ToastModule        } from 'primeng/toast';

import { MessageService } from 'primeng/api';

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
    ButtonModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    ToastModule,
  ],
  providers: [
    MessageService
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
  private messageService    = inject(MessageService);

  private fb = inject(FormBuilder);

  dictionariesList = signal<any>({});
  usersList        = signal<any>([]);
  
  saving = signal(false);

  createForm = this.fb.nonNullable.group({
    companyType    : ['', [ Validators.required ]],
    companyName    : ['', [ Validators.required ]],
    nip            : ['', [ Validators.required, Validators.pattern(/^\d{10}$/) ]],
    regon          : ['', [ Validators.required, Validators.pattern(/^\d{9}(\d{5})?$/) ]],
    krs            : ['', [ Validators.required, Validators.pattern(/^\d{10}$/) ]],
    isVatPayer     : false,
    accountManager : ['', [ Validators.required ]],
    firstName      : ['', [ Validators.required ]],
    lastName       : ['', [ Validators.required ]],
    pesel          : '', 
    email          : ['', [ Validators.required ]],
    phone          : ['', [ Validators.required ]],
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
    if(this.createForm.invalid) {
      this.messageService.add({ key: 'invalid', severity: 'error', summary: 'Komunikat', detail: 'Uzupełnij poprawnie pola w formularzu.' })
      this.createForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    this.clientService.create(this.createForm.getRawValue()).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (response: any) => {
        this.dialogRef.close(response);
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
