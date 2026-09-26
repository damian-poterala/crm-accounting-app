import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';

import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { TaskService } from '../../core/services/task.service'; 

import { MessageService } from 'primeng/api';

import { formatDateTimeToPl } from '../../core/utils/formatDateTimeToPl.utils';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    ToastModule,
    ChartModule,
    BadgeModule,
    TooltipModule,
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})
export class UserDashboard {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly taskService = inject(TaskService);

  private readonly messageService = inject(MessageService);

  readonly formatDateTimeToPl = formatDateTimeToPl;

  private router = inject(Router);

  dashboard = signal<any>({});
  savingTask = signal<any>(false);

  user: any = {};

  cooperationStatusChartData : any;
  companyTypeChartData       : any;

  cooperationStatusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          padding: 0,
          font: {
            size: 10
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  companyTypeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          padding: 0,
          font: {
            size: 10
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();

    this.loadDashboardInformation();
  }

  private loadDashboardInformation() {
    this.userService.getDashboardInformation().subscribe({
      next: (response: any) => {
        this.dashboard.set(response);
        console.log('Dashboard information: ', this.dashboard());

        this.prepareCooperationStatusChart(this.dashboard().client_by_cooperation_status);
        this.prepareCompanyTypeChart(this.dashboard().client_by_company_type);
      }
    })
  }

  private prepareCooperationStatusChart(data: any): void {
    this.cooperationStatusChartData = {
      labels: data.map((item: any) => this.wrapChartLabel(item.cooperation_status)),
      datasets: [
        {
          label: 'Ilość',
          data: data.map((item: any) => item.amount)
        }
      ]
    }
  }

  private prepareCompanyTypeChart(data: any): void {
    this.companyTypeChartData = {
      labels: data.map((item: any) => this.wrapChartLabel(item?.company_type)),
      datasets: [
        {
          label: 'Ilość',
          data: data.map((item: any) => item.amount)
        }
      ]
    }
  }

  private wrapChartLabel(label: string, maxCharacters: number = 13): string[] {
    if(!label) {
      return [];
    }

    const words = label.split(' ');
    const lines: string[] = [];
    
    let currentLine = '';

    for(const word of words) {
      const testLine = currentLine ? `${ currentLine } ${ word }` : word;

      if(currentLine && testLine.length > maxCharacters) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if(currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  redirectToClientDetails(id: any) {
    this.router.navigate([`/client/${ id }`])
  }

  completeTask(id: any) {
    this.savingTask.set(true);

    this.taskService.complete(id).subscribe({
      next: (response: any) => {
        this.savingTask.set(false);
        this.messageService.add({ key: 'complete-task', severity: 'success', summary: 'Komunikat', detail: response?.message });
        this.loadDashboardInformation();
      },
      error: (error: any) => {
        this.savingTask.set(false);
        this.messageService.add({ key: 'complete-task', severity: 'error', summary: 'Komunikat', detail: error?.message });
      }
    })
  }
}
