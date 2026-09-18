import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ButtonModule } from 'primeng/button';
import { ToastModule  } from 'primeng/toast';

import { MessageService } from 'primeng/api';

import { TaskService } from '../../../../core/services/task.service';

import { formatDateToPl } from '../../../../core/utils/formatDateToPl.utils';
import { formatDateTimeToPl } from '../../../../core/utils/formatDateTimeToPl.utils';

@Component({
  selector: 'app-task-details-view',
  standalone: true,
  imports: [
    CommonModule,

    ButtonModule,
    ToastModule,
  ],
  providers: [
    MessageService
  ],
  templateUrl: './task-details-view.html',
  styleUrl: './task-details-view.scss',
})
export class TaskDetailsView {
  private readonly taskService    = inject(TaskService);
  private readonly messageService = inject(MessageService);
  private readonly config         = inject(DynamicDialogConfig);
  private readonly dialogRef      = inject(DynamicDialogRef);

  readonly formatDateToPl = formatDateToPl;
  readonly formatDateTimeToPl = formatDateTimeToPl;

  task = signal<any>({});
  saving = signal<any>(false);

  ngOnInit(): void {
    this.task.set(this.config.data?.item);
    console.log('Task details: ', this.task);
  }

  removeTask() {

  }

  completeTask() {
    this.saving.set(true);

    this.taskService.complete(this.task().id).subscribe({
      next: (response: any) => {
        this.saving.set(false);

        this.messageService.add({ key: 'complete', severity: 'success', summary: 'Komunikat', detail: response?.message, life: 2000 });

        setTimeout(() => {
          this.dialogRef.close(response);
        }, 2000);
      },
      error: (error: any) => {
        this.saving.set(false);
        this.messageService.add({ key: 'complete', severity: 'error', summary: 'Komunikat', detail: error?.message });
      }
    })
  }

  formatDueDate() {

  }
}
