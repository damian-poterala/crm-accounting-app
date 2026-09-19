import { Component, inject, signal } from '@angular/core';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { ClientService } from '../../core/services/client.service';

import { MessageService } from 'primeng/api';

import { formatDateTimeToPl } from '../../core/utils/formatDateTimeToPl.utils';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})
export class UserDashboard {
  private readonly taskService = inject(TaskService);
  private readonly authService = inject(AuthService);
  private readonly clientService = inject(ClientService);

  private readonly messageService = inject(MessageService);

  readonly formatDateTimeToPl = formatDateTimeToPl;

  tasks      = signal<any[]>([]);
  clients    = signal<any[]>([]);
  savingTask = signal<any>(false);

  user: any = {};

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();

    this.loadTasks();
    this.loadClients();
  }

  private loadTasks() {
    this.taskService.getTasksPerUser(this.user().id).subscribe({
      next: (response: any) => {
        this.tasks.set(response);
        console.log(this.tasks());
      }
    });
  }

  private loadClients() {
    this.clientService.getClientsPerUser().subscribe({
      next: (response: any) => {
        this.clients.set(response);
        console.log('Clients list: ', this.clients());
      }
    })
  }

  completeTask(id: any) {
    this.savingTask.set(true);

    this.taskService.complete(id).subscribe({
      next: (response) => {
        this.savingTask.set(false);
        this.messageService.add({ key: 'complete-task', severity: 'success', summary: 'Komunikat', detail: response?.message });
        this.loadTasks();
      },
      error: (error) => {
        this.savingTask.set(false);
        this.messageService.add({ key: 'complete-task', severity: 'error', summary: 'Komunikat', detail: error?.message });
      }
    })
  }
}
