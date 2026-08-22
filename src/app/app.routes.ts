import { Routes } from '@angular/router';

import { authGuard  } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },

    { path: 'login'    , canActivate: [guestGuard], loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
    {
        path: '', canActivate: [authGuard], loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayout),
        children: [
            { path: 'dashboard'   , canActivate: [authGuard], loadComponent: () => import('./features/dashboard/dashboard')                             .then(d => d.Dashboard) },
            { path: 'declarations', canActivate: [authGuard], loadComponent: () => import('./features/declarations/declarations-view/declarations-view').then(dv => dv.DeclarationsView) },
            { path: 'client/:id'  , canActivate: [authGuard], loadComponent: () => import('./features/clients/client-details/client-details')           .then(cd => cd.ClientDetails) },
            { path: 'files'       , canActivate: [authGuard], loadComponent: () => import('./features/files/files-view/files-view')                     .then(fv => fv.FilesView) },
            { path: 'reports'     , canActivate: [authGuard], loadComponent: () => import('./features/reports/reports-view/reports-view')               .then(rv => rv.ReportsView) },
        ]
    }
];
