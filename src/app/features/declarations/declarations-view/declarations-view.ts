import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { TabsModule } from 'primeng/tabs';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

import { DeclarationsTable } from '../components/declarations-table/declarations-table';

@Component({
  selector: 'app-declarations-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    TabsModule,
    SelectModule,
    ButtonModule,

    DeclarationsTable,
  ],
  templateUrl: './declarations-view.html',
  styleUrl: './declarations-view.scss',
})
export class DeclarationsView {
  private readonly fb = inject(FormBuilder);

  constructor() {
    this.changeDeclarationType('DRA');
  }

  readonly years = [
    { label: '2024', value: 2024 },
    { label: '2025', value: 2025 },
    { label: '2026', value: 2026 },
  ];

  readonly declarationsForm = this.fb.nonNullable.group({
    year: new Date().getFullYear(),
  });  

  activeDeclarationType: 'DRA' | 'JPK' | 'VAT_UE' = 'DRA';

  changeYear(year: number): void {
    this.declarationsForm.patchValue({
      year
    });
  }

  changeDeclarationType(type: any): void {
    this.activeDeclarationType = type as 'DRA' | 'JPK' | 'VAT_UE';
  }

  saveDeclarations(): void {
    console.log('Save declarations obj: ', this.declarationsForm.getRawValue());
  }
}
