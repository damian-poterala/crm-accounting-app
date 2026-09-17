import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { SelectModule       } from 'primeng/select';
import { InputTextModule    } from 'primeng/inputtext';
import { ButtonModule       } from 'primeng/button';
import { TooltipModule      } from 'primeng/tooltip';
import { ToastModule        } from 'primeng/toast';
import { DatePickerModule   } from 'primeng/datepicker';
import { TextareaModule     } from 'primeng/textarea';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { MessageService } from 'primeng/api';

import { DictionaryService } from '../../../../core/services/dictionary.service';
import { TaskService       } from '../../../../core/services/task.service';
import { UserService       } from '../../../../core/services/user.service';
import { ClientService     } from '../../../../core/services/client.service';

import { formatDateToYmd } from '../../../../core/utils/formatDateToYmd.utils';

@Component({
  selector: 'app-task-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    SelectModule,
    InputTextModule,
    ButtonModule,
    TooltipModule,
    ToastModule,
    DatePickerModule,
    TextareaModule,
    AutoCompleteModule,
  ],
  providers: [
    MessageService
  ],
  templateUrl: './task-form-dialog.html',
  styleUrl: './task-form-dialog.scss',
})
export class TaskFormDialog {
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private fb = inject(FormBuilder);

  private dictionaryService = inject(DictionaryService);
  private taskService       = inject(TaskService);
  private userService       = inject(UserService);
  private messageService    = inject(MessageService);
  private clientService     = inject(ClientService);

  dictionariesList = signal<any>({});
  usersList        = signal<any>([]);
  clientsList      = signal<any>([]);
  saving           = signal<any>(false);

  form = this.fb.nonNullable.group({
    userId      : [null, [ Validators.required ]],
    clientId    : [null],
    description : ['', [ Validators.required ]],
    dueDate     : ['', [ Validators.required ]],
    isActive    : [true, [ Validators.required ]],
    isComplete  : [false, [ Validators.required ]],
    priorityId  : [null, [ Validators.required ]],
  });

  ngOnInit(): void {
    this.dictionaryService.getDictionary().subscribe({
      next: (response: any) => {
        this.dictionariesList.set(response.task_priority);
        console.log('Task priority list: ', this.dictionariesList());
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.usersList.set(response);
        console.log('Users list: ', this.usersList());
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  save() {
    if(this.form.invalid) {
      this.messageService.add({ key: 'invalid', severity: 'error', summary: 'Komunikat', detail: 'Uzupełnij poprawnie pola w formularzu.' });
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const formData = this.form.getRawValue();

    const data = {
      ...formData,
      dueDate: formatDateToYmd(formData.dueDate),
    }

    console.log(data);

    this.taskService.create(data).subscribe({
      next: (response: any) => {
        this.saving.set(false);

        this.messageService.add({ key: 'save', severity: 'success', summary: 'Komunikat', detail: response?.message, life: 2000 });

        setTimeout(() => {
          this.dialogRef.close(response);
        }, 2000);
      }, 
      error: (error: any) => {
        this.saving.set(false);
        this.messageService.add({ key: 'save', severity: 'error', summary: 'Komunikat', detail: error?.message });
      }
    })
  }

  close() {
    this.dialogRef.close();
  }

  searchClient(event: any) {
    this.clientService.autocomplete('company_name', event.query).subscribe((response: any) => {
      this.clientsList.set(response);
      console.log('Clients list: ', this.clientsList());
    });
  }
}
