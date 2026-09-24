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
        return this.http.get<Client[]>(`${ environment.apiUrl }/clients`);
    }

    getClientsPerUser() {
        return this.http.get<any[]>(`${ environment.apiUrl }/clients/user`);
    }

    getDetails(id: any) {
        return this.http.get<any>(`${ environment.apiUrl }/clients/${ id }/details`);
    }

    getFormData(id: number) {
        return this.http.get<any>(`${ environment.apiUrl }/clients/${ id }/form-data`);
    }

    autocomplete(field: string, query: string) {
        return this.http.get<any[]>(`${ environment.apiUrl }/clients/autocomplete`, { params: { field, query } });
    }

    search(request: any) {
        return this.http.post<any[]>(`${ environment.apiUrl }/clients/search`, request);
    }

    update(id: number, data: any) {
        return this.http.put<any>(`${ environment.apiUrl }/clients/${ id }`, data);
    }

    create(data: any) {
        return this.http.post<any>(`${ environment.apiUrl }/clients`, data);
    }

    updateDetails(data: any) {
        return this.http.put<any>(`${ environment.apiUrl }/clients/${ data.clientId }/details`, data);
    }

    importClient(data: {
        companyType: string;
        companyName: string;
        firstName: string;
        lastName: string;
        nip: string;
        regon: string;
        krs: string;
        pesel: string;
        email: string;
        phone: string;
        isVatPayer: boolean | null;
        cooperationStatus: string;
        accountManager: number | null;
        notes: string;
    }) {
        return this.http.post<{ success: boolean; client_id: number; }>(`${ environment.apiUrl }/clients/import`, data);
    }
}