import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class TaskService {
    private readonly http = inject(HttpClient);
    
    getTasksPerUser(id: any): Observable<any> {
        return this.http.get<any>(`${ environment.apiUrl }/task/${ id }`);
    }
}