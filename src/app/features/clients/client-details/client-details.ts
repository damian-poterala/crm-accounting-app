import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Navbar } from '../../../layout/navbar/navbar';

import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    Navbar,

    CommonModule,

    TabsModule,
    ButtonModule,
    TagModule,
  ],
  templateUrl: './client-details.html',
  styleUrl: './client-details.scss',
})
export class ClientDetails {}
