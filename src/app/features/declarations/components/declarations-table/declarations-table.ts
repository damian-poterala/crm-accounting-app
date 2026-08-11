import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';

import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-declarations-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    DatePickerModule,
    SelectModule,
    TooltipModule,
    ButtonModule,
  ],
  templateUrl: './declarations-table.html',
  styleUrl: './declarations-table.scss',
})
export class DeclarationsTable {
  private readonly fb = inject(FormBuilder);

  // declarationType = input.required<'DRA' | 'JPK' | 'VAT_UE'>();
  // year            = input.required<number>();

  @Input({ required: true }) declarationType !: 'DRA' | 'JPK' | 'VAT_UE';
  @Input({ required: true }) year !: number;

  readonly months = [
    { number: 1 , label: 'Styczeń', shortcut: 'Sty' },
    { number: 2 , label: 'Luty', shortcut: 'Lut' },
    { number: 3 , label: 'Marzec', shortcut: 'Mar' },
    { number: 4 , label: 'Kwiecień', shortcut: 'Kwi' },
    { number: 5 , label: 'MAj', shortcut: 'Maj' },
    { number: 6 , label: 'Czerwiec', shortcut: 'Cze' },
    { number: 7 , label: 'Lipiec', shortcut: 'Lip' },
    { number: 8 , label: 'Sierpień', shortcut: 'Sie' },
    { number: 9 , label: 'Wrzesień', shortcut: 'Wrz' },
    { number: 10, label: 'Październik', shortcut: 'Paź' },
    { number: 11, label: 'Listopad', shortcut: 'Lis' },
    { number: 12, label: 'Grudzień', shortcut: 'Gru' },
  ];

  readonly declarationsForm = this.fb.group({
    rows: this.fb.array([])
  });

  get rows(): FormArray {
    return this.declarationsForm.controls.rows;
  }

  readonly accountManagers = [
    { label: 'User A', value: 1 },
    { label: 'User B', value: 2 },
  ];

  ngOnInit(): void {
    const clients = [
      { id: 1, companyName: 'PCF Sp. z o.o.'   , accountManagerId: 1 },
      { id: 2, companyName: 'ABC Sp. z o.o.'   , accountManagerId: 2 },
      { id: 3, companyName: 'Studio Foto'      , accountManagerId: 2 },
      { id: 4, companyName: 'Medica Sp. z o.o.', accountManagerId: 1 },
    ];

    clients.forEach(client => {
      this.rows.push(this.createRow(client));
    });
  }

  private createRow(client: any): FormGroup {
    return this.fb.group({
      clientId: client.id,
      companyName: client.companyName,
      accountManagerId: client.accountManagerId,

      month1Date: null,
      month1Comment: '',
      month2Date: null,
      month2Comment: '',
      month3Date: null,
      month3Comment: '',
      month4Date: null,
      month4Comment: '',
      month5Date: null,
      month5Comment: '',
      month6Date: null,
      month6Comment: '',
      month7Date: null,
      month7Comment: '',
      month8Date: null,
      month8Comment: '',
      month9Date: null,
      month9Comment: '',
      month10Date: null,
      month10Comment: '',
      month11Date: null,
      month11Comment: '',
      month12Date: null,
      month12Comment: '',
    });
  }

  openCommentDialog(control: AbstractControl, month: number): void {
    const row = control as FormGroup;
    const comment = row.get(`month${ month }Comment`)?.value;
    console.log('Komentarz: ', comment);
  }

  hasComment(control: AbstractControl, month: number): boolean {
    const row = control as FormGroup;
    return !!row.get(`month${ month }Comment`)?.value;
  }

  getRow(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }
}
