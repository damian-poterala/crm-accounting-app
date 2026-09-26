import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class ReportService {
    private http = inject(HttpClient);

    downloadReport(endpoint: string): Observable<Blob> {
        return this.http.get(`${ environment.apiUrl }/${ endpoint }`, { responseType: 'blob' });
    }
}