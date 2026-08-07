import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-edit-basic-client-dialog',
  standalone: true,
  imports: [
    CommonModule,

    ButtonModule,
  ],
  templateUrl: './edit-basic-client-dialog.html',
  styleUrl: './edit-basic-client-dialog.scss',
})
export class EditBasicClientDialog {
  private readonly dialogRef = inject(DynamicDialogRef);
  readonly config            = inject(DynamicDialogConfig);

  close(): void {
    this.dialogRef.close();
  }
}
