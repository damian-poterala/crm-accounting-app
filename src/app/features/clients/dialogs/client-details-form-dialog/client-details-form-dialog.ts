import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { DictionaryService } from '../../../../core/services/dictionary.service';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { StepsModule } from 'primeng/steps';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';

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
  ],
  templateUrl: './client-details-form-dialog.html',
  styleUrl: './client-details-form-dialog.scss',
})
export class ClientDetailsFormDialog {
  private readonly dialogRef  = inject(DynamicDialogRef);
  private readonly config     = inject(DynamicDialogConfig);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dictionaryService = inject(DictionaryService)

  saving       = signal<Boolean>(false);
  dictionaries = signal<any>({});
  
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
    })
  }

  onActiveIndexChange(event: any) {
    this.activeIndex = event;
  }

  next() {
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

  save() {
    this.saving.set(true);
  }


}
