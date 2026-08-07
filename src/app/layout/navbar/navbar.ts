import { Component, ViewChild, inject } from '@angular/core';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    // RouterLink,
    // RouterLinkActive,

    AutoCompleteModule,
    Menu,
    ButtonModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.getCurrentUser();

  @ViewChild(Menu) menu!: Menu;

  items: MenuItem[] = [];

  constructor() {
    this.items = [
      { label: 'Ustawienia', icon: 'pi pi-cog', command: () => { console.log('Przekierowanie do okna ustawień') } },
      { separator: true },
      { label: 'Wyloguj', icon: 'pi pi-sign-out', command: () => { this.logout(); } }
    ];
  }
  
  ngOnInit() {
    console.log(this.user());
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearTokens();
        this.authService.currentUser.set(null);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.authService.clearTokens();
        this.authService.currentUser.set(null);
        this.router.navigate(['/login']);
      }
    })
  }
}
