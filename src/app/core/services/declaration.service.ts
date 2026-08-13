import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class DeclarationService {
    private readonly http = inject(HttpClient);

    getDeclarations(year: number, type: string) {
        return this.http.get(`${ environment.apiUrl }/declarations?year=${ year }&type=${ type }`);
    }

    saveDeclarations(payload: any) {
        return this.http.post(`${ environment.apiUrl }/declarations/save`, payload);
    }
}