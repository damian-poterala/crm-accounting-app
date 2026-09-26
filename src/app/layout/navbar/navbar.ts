import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';

import { AuthService } from '../../core/services/auth.service';
import { ClientService } from '../../core/services/client.service';

interface ClientSearchResult {
  id: number;
  company_name: string;
  nip: string | null;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    FormsModule,

    AutoCompleteModule,
    ButtonModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly authService   = inject(AuthService);
  private readonly clientService = inject(ClientService);
  private readonly router        = inject(Router);
  private readonly destroyRef    = inject(DestroyRef);

  readonly user = this.authService.getCurrentUser();

  readonly selectedClient = signal<string | ClientSearchResult | null>(null);
  readonly clientSuggestions = signal<ClientSearchResult[]>([]);
  readonly isSearching = signal(false);

  private readonly searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      tap(() => this.isSearching.set(true)),
      switchMap(query => {
        if(query.length < 2) {
          return of([]);
        }

        return forkJoin([
          this.clientService.autocomplete('company_name', query).pipe(catchError(() => of([]))),
          this.clientService.autocomplete('nip', query).pipe(catchError(() => of([]))),
          this.clientService.autocomplete('regon', query).pipe(catchError(() => of([])))
        ]);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(results => {
      const [byName, byNip, byRegon] = results;
      const unique = new Map<number, ClientSearchResult>();

      [...byName, ...byNip, ...byRegon].forEach((client: ClientSearchResult) => {
        if(client.id != null) {
          unique.set(client.id, client);
        }
      })

      this.clientSuggestions.set([...unique.values()].slice(0, 8));
      this.isSearching.set(false);
    });
  }

  searchClients(event: { query: string }): void {
    const query = event.query.trim();

    if(query.length < 2) {
      this.clientSuggestions.set([]);
      this.isSearching.set(false);
      this.searchSubject.next('');
      return;
    }

    this.searchSubject.next(query);
  }

  openClient(event: { value: ClientSearchResult }): void {
    const client = event.value;

    if(!client?.id) {
      return;
    }

    this.router.navigate(['/client', client.id]);
    this.selectedClient.set(null);
    this.clientSuggestions.set([]);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.finishLogout(),
      error: (error) => {
        console.log('Logout error: ', error);
        this.finishLogout();
      }
    })
  }

  private finishLogout(): void {
    this.authService.clearTokens();
    this.authService.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
