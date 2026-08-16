import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LoadingService } from '../../core/services/loader.service';

import { Sidebar } from '../sidebar/sidebar';
import { Navbar  } from '../navbar/navbar';
import { AppLoader } from '../../shared/components/app-loader/app-loader';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    
    Sidebar,
    Navbar,
    AppLoader,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  readonly loadingService = inject(LoadingService);
}
