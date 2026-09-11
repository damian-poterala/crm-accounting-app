import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadHandlerEvent } from 'primeng/fileupload';

import { FileUpload  } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';

import { FileService } from '../../../../core/services/file.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-client-file-form-dialog',
  imports: [
    CommonModule,

    FileUpload,
    ToastModule,
  ],
  providers: [
    MessageService
  ],
  templateUrl: './client-file-form-dialog.html',
  styleUrl: './client-file-form-dialog.scss',
})
export class ClientFileFormDialog {
  private readonly fileService = inject(FileService);
  private readonly messageService = inject(MessageService);

  private dialogRef = inject(DynamicDialogRef);
  private config    = inject(DynamicDialogConfig);

  clientId = this.config.data.clientId;

  saving = signal<any>(false);

  uploadFile(event: FileUploadHandlerEvent) {
    this.saving.set(true);

    const file = event.files[0];

    if(!file) {
      this.messageService.add({ key: 'invalid', severity: 'error', summary: 'Komunikat', detail: 'Wybierz plik do przesłania.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.fileService.upload(this.clientId, formData).subscribe({
      next: (response) => {
        this.saving.set(false);

        this.messageService.add({ key: 'upload', severity: 'success', summary: 'Komunikat', detail: response?.message, life: 2000 });

        setTimeout(() => {
          this.dialogRef.close(response);
        }, 2000);
      },
      error: (error) => {
        this.saving.set(false);
        this.messageService.add({ key: 'upload', severity: 'error', summary: 'Komunikat', detail: error?.message });
      }
    })
  }
}
