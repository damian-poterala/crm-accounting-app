import { Routes } from '@angular/router';

import { authGuard  } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
    
    { path: 'login'    , canActivate: [guestGuard], loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
    { path: 'dashboard', canActivate: [authGuard] , loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard) },
    { path: 'declarations', canActivate: [authGuard], loadComponent: () => import('./features/declarations/declarations-view/declarations-view').then(m => m.DeclarationsView) },

    { path: 'client/:id', loadComponent: () => import('./features/clients/client-details/client-details').then(c => c.ClientDetails) },
];
