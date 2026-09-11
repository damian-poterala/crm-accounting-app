import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class StatisticService {
    private http = inject(HttpClient);

    getStatistics() {
        return this.http.get<any>(`${ environment.apiUrl }/statistic`);
    }
}