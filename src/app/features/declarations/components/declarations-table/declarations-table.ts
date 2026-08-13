import { Component, inject, Input, signal, OnChanges, SimpleChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, FormGroup, AbstractControl, FormsModule } from '@angular/forms';

import { DeclarationService } from '../../../../core/services/declaration.service';
import { UserService } from '../../../../core/services/user.service';

import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { PopoverModule, Popover } from 'primeng/popover';  
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-declarations-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    DatePickerModule,
    SelectModule,
    TooltipModule,
    ButtonModule,
    PopoverModule,
    TextareaModule,
  ],
  templateUrl: './declarations-table.html',
  styleUrl: './declarations-table.scss',
})
export class DeclarationsTable implements OnInit, OnChanges {
  private readonly fb                 = inject(FormBuilder);
  private readonly declarationService = inject(DeclarationService);
  private userService = inject(UserService);
  private readonly cdr                = inject(ChangeDetectorRef);

  readonly editingCell      = signal<{ clientId: number; month: number } | null>(null);

  private lastLoadedYear: number | null = null;
  private lastLoadedType: 'DRA' | 'JPK' | 'VAT_UE' | null = null;

  @Input({ required: true }) declarationType !: 'DRA' | 'JPK' | 'VAT_UE';
  @Input({ required: true }) year !: number;

  selectedRow   : FormGroup | null = null;
  selectedMonth : number    | null = null;
  selectedDate  : Date      | null = null;

  selectedComment = '';
  private selectedCommentRow !: FormGroup;
  private selectedCommentMonth !: number;

  accountManagers: { label: string; value: number }[] = [];

  readonly months = [
    { number: 1 , label: 'Styczeń'    , shortcut: 'Sty' },
    { number: 2 , label: 'Luty'       , shortcut: 'Lut' },
    { number: 3 , label: 'Marzec'     , shortcut: 'Mar' },
    { number: 4 , label: 'Kwiecień'   , shortcut: 'Kwi' },
    { number: 5 , label: 'Maj'        , shortcut: 'Maj' },
    { number: 6 , label: 'Czerwiec'   , shortcut: 'Cze' },
    { number: 7 , label: 'Lipiec'     , shortcut: 'Lip' },
    { number: 8 , label: 'Sierpień'   , shortcut: 'Sie' },
    { number: 9 , label: 'Wrzesień'   , shortcut: 'Wrz' },
    { number: 10, label: 'Październik', shortcut: 'Paź' },
    { number: 11, label: 'Listopad'   , shortcut: 'Lis' },
    { number: 12, label: 'Grudzień'   , shortcut: 'Gru' },
  ];

  readonly declarationsForm = this.fb.group({
    rows: this.fb.array([])
  });

  get rows(): FormArray {
    return this.declarationsForm.controls.rows;
  }

  ngOnInit(): void {
    this.loadAccountManagers();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (!this.year || !this.declarationType) {
      return;
    }

    if (this.lastLoadedYear === this.year && this.lastLoadedType === this.declarationType) {
      return;
    }

    this.lastLoadedYear = this.year;
    this.lastLoadedType = this.declarationType;

    this.loadDeclarations();

  }

  private loadDeclarations(): void {
    console.count(`load ${this.declarationType}`);

    this.declarationService.getDeclarations(this.year, this.declarationType).subscribe({
      next: (response: any) => {
        this.buildForm(response);
        this.cdr.markForCheck();
      }, 
      error: (error: any) => {
        console.log('Błąd pobierania deklaracji: ', error);
      }
    })
  }

  private buildForm(data: any[]): void {
    console.count(`buildForm ${this.declarationType}`);
    this.rows.clear();

    data.forEach(client => {
      const months = client.months || {};

      this.rows.push(
        this.fb.group({
          clientId: client.clientId,
          companyName: client.companyName,
          accountManagerId: Number(client.accountManagerId),

          month1Date: months['1']?.date ?? null,
          month1Comment: months['1']?.comment ?? '',

          month2Date: months['2']?.date ?? null,
          month2Comment: months['2']?.comment ?? '',

          month3Date: months['3']?.date ?? null,
          month3Comment: months['3']?.comment ?? '',

          month4Date: months['4']?.date ?? null,
          month4Comment: months['4']?.comment ?? '',

          month5Date: months['5']?.date ?? null,
          month5Comment: months['5']?.comment ?? '',

          month6Date: months['6']?.date ?? null,
          month6Comment: months['6']?.comment ?? '',

          month7Date: months['7']?.date ?? null,
          month7Comment: months['7']?.comment ?? '',

          month8Date: months['8']?.date ?? null,
          month8Comment: months['8']?.comment ?? '',

          month9Date: months['9']?.date ?? null,
          month9Comment: months['9']?.comment ?? '',

          month10Date: months['10']?.date ?? null,
          month10Comment: months['10']?.comment ?? '',

          month11Date: months['11']?.date ?? null,
          month11Comment: months['11']?.comment ?? '',

          month12Date: months['12']?.date ?? null,
          month12Comment: months['12']?.comment ?? ''
        })
      );
    });
  }

  private loadAccountManagers(): void {
    this.userService.getUsers().subscribe((response: any) => {
      this.accountManagers = response.map((user: any) => ({
        label: user.username,
        value: user.id
      }));
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

  openDatePicker(event: Event, row: FormGroup, month: number, popover: Popover): void {
    this.selectedRow = row;
    this.selectedMonth = month;

    const value = row.get(`month${ month }Date`)?.value;
    this.selectedDate = value ? new Date(value) : null;
    popover.show(event);
  }

  saveSelectedDate(popover: Popover): void {
    if(this.selectedRow && this.selectedMonth) {
      this.selectedRow.get(`month${ this.selectedMonth }Date`)?.setValue(this.selectedDate);
    }

    popover.hide();
  }

  openCommentPopover(event: Event, row: FormGroup, month: number, popover: Popover): void {
    this.selectedCommentRow = row;
    this.selectedCommentMonth = month;
    this.selectedComment = row.get(`month${ month }Comment`)?.value || '';

    popover.toggle(event);
  }

  saveComment(popover: Popover): void {
    this.selectedCommentRow.get(`month${ this.selectedCommentMonth}Comment`)?.setValue(this.selectedComment);
    popover.hide();
  }

  formatDate(value: any): string {
    if (!value) {
      return '-';
    }

    if (typeof value === 'string') {
      const parts = value.split('-');

      if (parts.length === 3) {
        return `${parts[1]}-${parts[2]}`;
      }

      return '-';
    }

    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${month}-${day}`;
  }

  private formatDateForApi(value: Date | string | null): string | null {
    if (!value) {
      return null;
    }

    if (typeof value === 'string') {
      return value;
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  saveDeclarations(): void {
    const payload = {
      year: this.year,
      type: this.declarationType,
      rows: this.rows.controls.map(control => {
        const row = control.value;

        return {
          clientId: row.clientId,
          accountManagerId: row.accountManagerId,
          months: this.months.map(month => ({
            month: month.number,
            date: this.formatDateForApi(row[`month${ month.number }Date`]) || null,
            comment: row[`month${ month.number }Comment`] || ''
          }))
        };
      })
    };

    console.log(payload);

    this.declarationService.saveDeclarations(payload).subscribe({
      next: () => {
        console.log('Deklaracje zapisane');
      },
      error: (error) => {
        console.log('Błąd zapisu deklaracji', error);
      }
    })
  }
}
