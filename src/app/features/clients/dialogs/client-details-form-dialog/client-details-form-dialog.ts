import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { DictionaryService } from '../../../../core/services/dictionary.service';
import { UserService       } from '../../../../core/services/user.service';
import { ClientService     } from '../../../../core/services/client.service';

import { formatDateToYmd } from '../../../../core/utils/formatDateToYmd.utils';

import { MessageService } from 'primeng/api';

import { ButtonModule      } from 'primeng/button';
import { SelectModule      } from 'primeng/select';
import { DatePickerModule  } from 'primeng/datepicker';
import { CheckboxModule    } from 'primeng/checkbox';
import { InputTextModule   } from 'primeng/inputtext';
import { StepsModule       } from 'primeng/steps';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule    } from 'primeng/textarea';
import { ToastModule       } from 'primeng/toast';

@Component({
  selector: 'app-client-details-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    ButtonModule,
    SelectModule,
    DatePickerModule,
    CheckboxModule,
    InputTextModule,
    StepsModule,
    MultiSelectModule,
    TextareaModule,
    ToastModule,
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './client-details-form-dialog.html',
  styleUrl: './client-details-form-dialog.scss',
})
export class ClientDetailsFormDialog {
  private readonly dialogRef         = inject(DynamicDialogRef);
  private readonly config            = inject(DynamicDialogConfig);
  private readonly destroyRef        = inject(DestroyRef);
  private readonly messageService    = inject(MessageService);

  private readonly dictionaryService = inject(DictionaryService);
  private readonly userService       = inject(UserService);
  private readonly clientService     = inject(ClientService);

  private fb = inject(FormBuilder);

  form = this.fb.group({
    contractSignedAt   : ['', [ Validators.required ]],
    serviceStartDate   : ['', [ Validators.required ]],
    serviceEndDate     : [''],
    contractNumber     : ['', [ Validators.required ]],
    electronicContract : [false],
    leadSource         : [null],
    monthlyFee         : [null, [ Validators.required ]],
    paymentDueDate     : ['', [ Validators.required ]],
    paymentMethod      : [null, [ Validators.required ]],
    documentsLimit     : ['', [ Validators.required ]],
    vatPeriod          : [null, [ Validators.required ]],
    incomeTaxPeriod    : [null, [ Validators.required ]],
    kpir: this.fb.group({
      enabled   : [false],
      programId : [null, [ Validators.required ]]
    }),
    kh: this.fb.group({
      enabled   : [false],
      programId : [null]
    }),
    uepik: this.fb.group({
      enabled   : [false],
      programId : [null],
    }),
    kadry: this.fb.group({
     enabled   : [false],
     programId : [null, [ Validators.required ]] 
    }),
    zusNotApplicable : [false],
    zusPayer         : [false],
    relief: this.fb.group({
      enabled            : [false],
      validFrom          : ['', [ Validators.required ]],
      validTo            : ['', [ Validators.required ]],
      socialContribution : [false],
      healthContribution : [false],
    }),
    preferential: this.fb.group({
      enabled            : [false],
      validFrom          : ['', [ Validators.required ]],
      validTo            : ['', [ Validators.required ]],
      socialContribution : [false],
      healthContribution : [false],
    }),
    full: this.fb.group({
      enabled            : [false],
      validFrom          : ['', [ Validators.required ]],
      validTo            : ['', [ Validators.required ]],
      socialContribution : [false],
      healthContribution : [false],
    }),
    smallPlus: this.fb.group({
      enabled            : [false],
      validFrom          : ['', [ Validators.required ]],
      validTo            : ['', [ Validators.required ]],
      socialContribution : [false],
      healthContribution : [false],
    }),
    notes: this.fb.group({
      content: ['']
    })
  });

  saving       = signal<Boolean>(false);
  dictionaries = signal<any>({});
  users        = signal<any>([]);
  
  activeIndex: number = 0;

  steps: any = [
    { label : 'Umowa i współpraca', command: () => this.activeIndex = 0 },
    { label : 'Księgowość'        , command: () => this.activeIndex = 1 },
    { label : 'Podatki i VAT'     , command: () => this.activeIndex = 2 },
    { label : 'ZUS'               , command: () => this.activeIndex = 3 },
    { label : 'Uwagi'             , command: () => this.activeIndex = 4 },
    { label : 'Podsumowanie'      , command: () => this.activeIndex = 5 }
  ];

  ngOnInit(): void {
    this.dictionaryService.getDictionary().subscribe({
      next: (response: any) => {
        this.dictionaries.set(response);
        console.log('Dictionaries: ', this.dictionaries());
      }
    });

    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.users.set(response);
        console.log(this.users());
      }
    })
  }

  onActiveIndexChange(event: any) {
    this.activeIndex = event;
  }

  next(): void {
    // if(this.activeIndex == 0) {
    //   this.form.markAllAsTouched();

    //   if(this.form.invalid) {
    //     return this.messageService.add({ key: 'invalid', severity: 'error', summary: 'Błąd', detail: 'Błąd danych formularza. Uzupełnij poprawnie formularz.' });
    //   }
    // }

    // if(this.activeIndex < this.steps.length - 1) {
    //   this.activeIndex++;
    // }
    this.activeIndex++;
  }

  prev() {
    if(this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  close(): void {
    this.dialogRef.close(); 
  }

  save(): void {
    this.saving.set(true);
    console.log(this.config.data.clientId);

    let obj = {
      clientId           : this.config.data.clientId, 
      contractSignedAt   : formatDateToYmd(this.form.controls.contractSignedAt.value),
      serviceStartDate   : formatDateToYmd(this.form.controls.serviceStartDate.value),
      serviceEndDate     : this.form.controls.serviceEndDate.value == '' ? null : formatDateToYmd(this.form.controls.serviceEndDate.value),
      contractNumber     : this.form.controls.contractNumber.value,
      electronicContract : this.form.controls.electronicContract.value,
      leadSourceId       : this.form.controls.leadSource.value,
      monthlyFee         : this.form.controls.monthlyFee.value,
      paymentDueDate     : this.form.controls.paymentDueDate.value,
      paymentMethodId    : this.form.controls.paymentMethod.value,
      documentsLimit     : this.form.controls.documentsLimit.value,
      vatPeriodId        : this.form.controls.vatPeriod.value,
      incomeTaxPeriodId  : this.form.controls.incomeTaxPeriod.value,
      zusNotApplicable   : this.form.controls.zusNotApplicable.value,
      zusContributor     : this.form.controls.zusPayer.value
    }

    console.log(obj);
    
    this.clientService.updateDetails(obj).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }


}
