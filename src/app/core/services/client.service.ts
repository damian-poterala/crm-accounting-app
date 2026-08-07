import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Client } from "../models";

import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class ClientService {
    private http = inject(HttpClient);

    getClients() {
        return this.http.get<Client[]>(`${ environment.apiUrl }/clients`)
    }

    autocomplete(field: string, query: string) {
        return this.http.get<any[]>(`${ environment.apiUrl }/clients/autocomplete`, { params: { field, query } });
    }

    search(request: any) {
        return this.http.post<any[]>(`${ environment.apiUrl }/clients/search`, request);
    }
}