import { Component, inject, signal } from '@angular/core';

import { ChartModule } from 'primeng/chart';

import { StatisticService } from '../../core/services/statistic.service';

interface ClientByManager {
  amount: number;
  account_manager_id: number;
  username: string;
}

interface ClientByLeadSource {
  lead_source_id: number;
  lead_source: string;
  amount_clients: number;
}

interface ClientByMonth {
  year: number,
  month: number,
  amount: number
}

interface CooperationStatus {
  amount: number;
  cooperation_status: string;
}

interface StatisticsResponse {
  all_clients: number;
  active_clients: number;
  new_clients_current_month: number;
  monthly_fee_sum: string;
  client_by_manager: ClientByManager[];
  client_by_lead_source: ClientByLeadSource[];
  client_by_month: ClientByMonth[];
  client_by_cooperation_status: CooperationStatus[];
}

@Component({
  selector: 'app-statistics',
  imports: [
    ChartModule
  ],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss',
})
export class Statistics {
  private readonly statisticService = inject(StatisticService);

  statistics = signal<any>({});

  managerChartData    : any;
  leadSourceChartData : any;
  monthChartData      : any;
  cooperationStatusChartData: any;

  managerChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  leadSourceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  monthChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  }

  cooperationStatusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  }

  getCurrentMonthName(): string {
    const month = new Intl.DateTimeFormat('pl-PL', { month: 'long' }).format(new Date());

    return month.charAt(0).toUpperCase() + month.slice(1);
  }

  ngOnInit() {
    this.loadStatistic();
  }

  private loadStatistic() {
    this.statisticService.getStatistics().subscribe({
      next: (response) => {
        this.statistics.set(response);
        console.log('Statistics: ', this.statistics());

        this.prepareManagerChart(response?.client_by_manager);
        this.prepareLeadSourceChart(response?.client_by_lead_source);
        this.prepareMonthSourceChart(response?.client_by_month);
        this.prepareCooperationStatusChart(response?.client_by_cooperation_status);
      }, 
      error: (error) => {
        console.log(error);
      }
    });
  }

  private prepareManagerChart(data: ClientByManager[]): void {
    this.managerChartData = {
      labels: data.map(item => item.username),
      datasets: [
        {
          label: 'Liczba klientów',
          data: data.map(item => item.amount)
        }
      ]
    }
  }

  private prepareLeadSourceChart(data: ClientByLeadSource[]): void {
    this.leadSourceChartData = {
      labels: data.map(item => item.lead_source),
      datasets: [
        {
          label: 'Ilość',
          data: data.map(item => item.amount_clients)
        }
      ]
    }
  }

  private prepareMonthSourceChart(data: ClientByMonth[]): void {
    this.monthChartData = {
      labels: data.map(item => `${ item?.month } ${ item?.year }`),
      datasets: [
        {
          label: 'Ilość',
          data: data.map(item => item.amount)
        }
      ]
    }
  }

  private prepareCooperationStatusChart(data: CooperationStatus[]): void {
    this.cooperationStatusChartData = {
      labels: data.map(item => item.cooperation_status),
      datasets: [
        {
          label: 'Ilość',
          data: data.map(item => item.amount)
        }
      ]
    }
  }
}
