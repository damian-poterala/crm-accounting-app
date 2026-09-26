import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { ReportService } from '../../../core/services/report.service';

import { ButtonModule } from 'primeng/button'; 

interface Report {
  id          : number;
  title       : string;
  description : string;
  endpoint    : string;
  fileName    : string;
}

@Component({
  selector: 'app-reports-view',
  standalone: true,
  imports: [
    CommonModule,

    ButtonModule,
  ],
  templateUrl: './reports-view.html',
  styleUrl: './reports-view.scss',
})

export class ReportsView {
  private readonly reportService = inject(ReportService);

  readonly downloadingReportId = signal<number | null>(null);

  reports: Report[] = [
    {
      id: 1,
      title: 'Lista aktywnych klientów',
      description: 'Zestawienie klientów z aktywną współpracą, danymi firmy, numerami indentyfikacyjnymi i przypisanymi opiekunami.',
      endpoint: 'reports/excel/all-active-clients',
      fileName: 'raport-aktywnych-klientow.xlsx',
    },
    {
      id: 2,
      title: 'Lista wszystkich zadań',
      description: 'Zadania z terminami realizacji, priorytetami, statusem oraz przypisanymi pracownikami i klientami.',
      endpoint: 'reports/excel/all-tasks',
      fileName: 'raport-zadan.xlsx'
    },
  ];

  downloadReport(report: Report): void {
    if(this.downloadingReportId() !== null) {
      return;
    }

    this.downloadingReportId.set(report.id);

    this.reportService.downloadReport(report.endpoint).pipe(finalize(() => {
      this.downloadingReportId.set(null);
    })).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = report.fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      error: (error: any) => {
        console.log('Report download error: ', error);
      }
    })
  }
}
