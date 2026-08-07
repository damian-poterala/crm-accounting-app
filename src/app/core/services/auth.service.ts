import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';

import { environment } from '../../../environments/environment';

import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private http = inject(HttpClient);
    currentUser = signal<User | null>(null);


    login(data: { username: string, password: string }) {
        return this.http.post(`${ environment.apiUrl }/auth/login`, data);
    }

    me() {
        return this.http.get<User>(`${ environment.apiUrl }/auth/me`);
    }

    logout() {
        return this.http.post(`${ environment.apiUrl }/auth/logout`, { refreshToken: this.getRefreshToken() });
    }

    clearTokens(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    saveTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    isLoggedIn(): boolean {
        return !!this.getAccessToken();
    }

    refresh() {
        console.log('WYWOŁADNO /refresh');
        return this.http.post<{ accessToken: string; refreshToken: string; }>(`${ environment.apiUrl }/auth/refresh`, { refreshToken: this.getRefreshToken() });
    }

    setCurrentUser(user: User): void {
        this.currentUser.set(user);
    }

    getCurrentUser() {
        return this.currentUser;
    }

    loadCurrentUser() {
        if(!this.getAccessToken()) {
            return;
        }

        this.me().subscribe({
            next: (user) => {
                this.currentUser.set(user);
            },
            error: () => {
                this.clearTokens();
                this.currentUser.set(null);
            }
        })
    }
}