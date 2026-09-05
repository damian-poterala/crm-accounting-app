import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';

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
    }),
    vatPayer: this.fb.group({
      enabled  : [false], 
      dateFrom : [null],
      dateTo   : [null],
    }),
    vatUe: this.fb.group({
      enabled  : [false], 
      dateFrom : [null],
      dateTo   : [null],
    }),
    vatExemptSubject: this.fb.group({
      enabled  : [false], 
      dateFrom : [null],
      dateTo   : [null],
    }),
    vatExemptEntity: this.fb.group({
      enabled  : [false], 
      dateFrom : [null],
      dateTo   : [null],
    }),
    vat9m: this.fb.group({
      enabled  : [false], 
      dateFrom : [null],
      dateTo   : [null],
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
    this.disableZusField('relief');
    this.disableZusField('preferential');
    this.disableZusField('full');
    this.disableZusField('smallPlus');

    this.dictionaryService.getDictionary().subscribe({
      next: (response: any) => {
        this.dictionaries.set(response);
        console.log('Dictionaries: ', this.dictionaries());

        this.clientService.getFormData(this.config.data.clientId).subscribe({
          next: (response: any) => {
            console.log(response);
            this.form.patchValue(response);
            this.setZusGroupState('relief');
            this.setZusGroupState('preferential')
            this.setZusGroupState('full');
            this.setZusGroupState('smallPlus');
          },
          error: (error: any) => {
            console.log(error);
          }
        });
      }
    });

    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.users.set(response);
        console.log(this.users());
      }
    });
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

    console.log(this.form.getRawValue());

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
      zusContributor     : this.form.controls.zusPayer.value,
      comment            : this.form.controls.notes.controls.content.value,
      services           : this.getServices(),
      registrations      : this.getZusRegistration(),
      vatStatuses        : this.getVatStatus(),
    }

    // console.log(obj);
    
    this.clientService.updateDetails(obj).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  // validators

  toggleZusGroup(groupName: 'relief' | 'preferential' | 'full' | 'smallPlus', enabled: boolean): void {
    const group = this.form.controls[groupName];

    const controls = [
      group.controls.validFrom,
      group.controls.validTo,
      group.controls.socialContribution,
      group.controls.healthContribution,
    ];

    controls.forEach(control => enabled ? control.enable() : control.disable());
  }

  disableZusField(groupName: 'relief' | 'preferential' | 'full' | 'smallPlus'): void {
    const group = this.form.controls[groupName];

    group.controls.validFrom.disable();
    group.controls.validTo.disable();
    group.controls.socialContribution.disable();
    group.controls.healthContribution.disable();
  }

  setZusGroupState(groupName: 'relief' | 'preferential' | 'full' | 'smallPlus'): void {
    const group = this.form.controls[groupName];

    if(group.controls.enabled.value) {
      group.controls.validFrom.enable();
      group.controls.validTo.enable();
      group.controls.socialContribution.enable();
      group.controls.healthContribution.enable();
    } else {
      group.controls.validFrom.disable();
      group.controls.validTo.disable();
      group.controls.socialContribution.disable();
      group.controls.healthContribution.disable();
    }
  }

  private getAccountingServiceId(valueKey: string): number | null {
    const dictionary = this.dictionaries().accounting_type;

    const item = dictionary.find((item: any) => item.value == valueKey);
    return item?.id ?? null;
  }

  private getRegistrationTypeId(valueKey: string): any {
    const dictionary = this.dictionaries().registration_type;

    const item = dictionary.find((item: any) => item.value == valueKey);
    return item?.id ?? null;
  }

  private getVatStatusId(valueKey: string): any {
    const dictionary = this.dictionaries().vat_status;

    const item = dictionary.find((item: any) => item.value == valueKey);
    return item?.id ?? null;
  }

  private getServices() {
    const form = this.form.getRawValue();

    const services = [];

    if(form.kpir.enabled) {
      services.push({
        serviceId: this.getAccountingServiceId('kpir'),
        programId: form.kpir.programId,
      });
    }

    if(form.kh.enabled) {
      services.push({
        serviceId: this.getAccountingServiceId('kh'),
        programId: null,
      });
    }

    if(form.uepik.enabled) {
      services.push({
        serviceId: this.getAccountingServiceId('uepik'),
        programId: null
      });
    }

    if(form.kadry.enabled) {
      services.push({
        serviceId: this.getAccountingServiceId('hr'),
        programId: form.kadry.programId,
      });
    }

    return services;
  }

  private getZusRegistration() {
    const form  = this.form.getRawValue();

    const registrations = [];

    if(form.relief.enabled) {
      registrations.push({
        registrationTypeId : this.getRegistrationTypeId('0540'),
        dateFrom           : formatDateToYmd(form.relief.validFrom),
        dateTo             : formatDateToYmd(form.relief.validTo),
        healthContribution : form.relief.healthContribution,
        socialContribution : form.relief.socialContribution,
      });
    }

    if(form.preferential.enabled) {
      registrations.push({
        registrationTypeId : this.getRegistrationTypeId('0570'),
        dateFrom           : formatDateToYmd(form.preferential.validFrom),
        dateTo             : formatDateToYmd(form.preferential.validTo),
        healthContribution : form.preferential.healthContribution,
        socialContribution : form.preferential.socialContribution,
      });
    }

    if(form.full.enabled) {
      registrations.push({
        registrationTypeId : this.getRegistrationTypeId('0510'),
        dateFrom           : formatDateToYmd(form.full.validFrom),
        dateTo             : formatDateToYmd(form.full.validTo),
        healthContribution : form.full.healthContribution,
        socialContribution : form.full.socialContribution,
      });
    }

    if(form.smallPlus.enabled) {
      registrations.push({
        registrationTypeId : this.getRegistrationTypeId('0580'),
        dateFrom           : formatDateToYmd(form.smallPlus.validFrom),
        dateTo             : formatDateToYmd(form.smallPlus.validTo),
        healthContribution : form.smallPlus.healthContribution,
        socialContribution : form.smallPlus.socialContribution,
      });
    }

    return registrations;
  }

  private getVatStatus() {
    const form = this.form.getRawValue();

    const vatStatuses = [];

    if(form.vatPayer.enabled) {
      vatStatuses.push({
        vatStatusId : this.getVatStatusId('vat_registered'),
        dateFrom    : formatDateToYmd(form.vatPayer.dateFrom),
        dateTo      : formatDateToYmd(form.vatPayer.dateTo),
      });
    }

    if(form.vatUe.enabled) {
      vatStatuses.push({
        vatStatusId : this.getVatStatusId('vat_eu'),
        dateFrom    : formatDateToYmd(form.vatUe.dateFrom),
        dateTo      : formatDateToYmd(form.vatUe.dateTo),
      });
    }

    if(form.vatExemptSubject.enabled) {
      vatStatuses.push({
        vatStatusId : this.getVatStatusId('vat_subject_exempt'),
        dateFrom    : formatDateToYmd(form.vatExemptSubject.dateFrom),
        dateTo      : formatDateToYmd(form.vatExemptSubject.dateTo),
      });
    }

    if(form.vatExemptEntity.enabled) {
      vatStatuses.push({
        vatStatusId : this.getVatStatusId('vat_entity_exempt'),
        dateFrom    : formatDateToYmd(form.vatExemptEntity.dateFrom),
        dateTo      : formatDateToYmd(form.vatExemptEntity.dateTo),
      });
    }

    if(form.vat9m.enabled) {
      vatStatuses.push({
        vatStatusId : this.getVatStatusId('vat_9m'),
        dateFrom    : formatDateToYmd(form.vat9m.dateFrom),
        dateTo      : formatDateToYmd(form.vat9m.dateTo),
      });
    }

    return vatStatuses;
  }
}
