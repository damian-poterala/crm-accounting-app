import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from './layout/sidebar/sidebar';
import { Navbar } from './layout/navbar/navbar';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
  
    Navbar,
    Sidebar,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('hive-crm-app');

  private authService = inject(AuthService);

  constructor() {
    this.authService.loadCurrentUser();
  }
}
