import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';

import { AuthService } from '../../../core/services/auth.service';

interface TaskDay {
  date      : Date;
  dayName   : string;
  dayNumber : number;
  month     : string;
  fullDate  : string;
}

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [
    CommonModule,

    CheckboxModule,
    DatePickerModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [
    MessageService
  ],
  templateUrl: './task-view.html',
  styleUrl: './task-view.scss',
})
export class TaskView {
  private readonly authService = inject(AuthService);

  currentWeekStart : Date = this.getMonday(new Date());
  weekDays         : TaskDay[] = [];

  employees = computed<any[]>(() => {
    const user = this.authService.currentUser();

    if(!user) {
      return [];
    }

    return [
      { id: user.id, name: user.username }
    ];
  })

  constructor() {
    this.generateWeek();
  }

  generateWeek(): void {
    this.weekDays = [];

    const dayNames = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];

    for(let i = 0; i < 5; i++) {
      const date = new Date(this.currentWeekStart);

      date.setDate(this.currentWeekStart.getDate() + i);

      this.weekDays.push({
        date,
        dayName   : dayNames[i],
        dayNumber : date.getDate(),
        month     : this.getMonthName(date),
        fullDate: this.formatDate(date),
      });
    }
  }

  previosWeek(): void {
    const date = new Date(this.currentWeekStart);

    date.setDate(date.getDate() - 7);
    this.currentWeekStart = date;

    this.generateWeek();
  }

  nextWeek(): void {
    const date = new Date(this.currentWeekStart);

    date.setDate(date.getDate() + 7);
    this.currentWeekStart = date;

    this.generateWeek();
  }

  today(): void {
    this.currentWeekStart = this.getMonday(new Date());
    this.generateWeek();
  }

  private getMonday(date: Date): Date {
    const result = new Date(date);

    result.setHours(0, 0, 0, 0);
    
    const day        = result.getDay();
    const difference = day === 0 ? -6 : 1 -day;

    result.setDate(result.getDate() + difference);
    
    return result;
  }

  private getMonthName(date: Date): string {
    return new Intl.DateTimeFormat('pl-PL', { month: 'long' }).format(date);
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${ year }-${ month }-${ day }`;
  }
}
